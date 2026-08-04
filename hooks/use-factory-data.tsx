'use client';

import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { subscribeCalls } from '../lib/firebase/calls-service';
import { subscribeCompanies } from '../lib/firebase/companies-service';
import { isFirebaseConfigured } from '../lib/firebase/firebase-config';
import { subscribeLines } from '../lib/firebase/lines-service';
import { subscribeProblems } from '../lib/firebase/problems-service';
import { subscribeTechnicians } from '../lib/firebase/technicians-service';
import { subscribeUsers } from '../lib/firebase/users-service';
import { getUserRole, hasPortalRole } from '../lib/firebase/auth-service';
import { useAuthContext } from './auth-context';
import type { Locale } from '../i18n/i18n-provider';
import { formatDateTime } from '../lib/format-date';
import { modules as demoModules } from '../components/mock-data';
import type { PortalModule } from '../components/portal-types';
import type { Company, DeviceToken, FactoryCall, Operator, PortalUser, PreventiveWork, Problem, ProductionLine, Technician } from '../types/firebase-models';

const text = (value?: string | number | null) => value === undefined || value === null || value === '' ? '—' : String(value);
const statusLabel = (value?: string) => ({ waiting: 'Naujas', accepted: 'Priskirtas', repairing: 'Vykdomas', completed: 'Uždarytas' }[value ?? ''] ?? value ?? '—');
const emptyOperators: Operator[] = [];
const emptyTokens: DeviceToken[] = [];
const emptyPreventiveWorks: PreventiveWork[] = [];

export function useFactoryData(locale: Locale = 'lt') {
  const [calls, setCalls] = useState<FactoryCall[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const operators = emptyOperators;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const tokens = emptyTokens;
  const preventiveWorks = emptyPreventiveWorks;
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [listenerErrors, setListenerErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isFirebaseConfigured()) { setLoading(false); return; }
    let active = true;
    let remaining = 6;
    const completedPaths = new Set<string>();
    const ready = (path: string) => {
      if (completedPaths.has(path)) return;
      completedPaths.add(path);
      remaining -= 1;
      if (active && remaining <= 0) setLoading(false);
    };
    const failed = (path: string) => (reason: Error) => {
      if (active) setListenerErrors(current => ({ ...current, [path]: reason.message }));
      ready(path);
    };
    const received = <T,>(path: string, update: (items: T[]) => void) => (items: T[]) => {
      if (active) {
        update(items);
        setListenerErrors(current => {
          if (!(path in current)) return current;
          const { [path]: _ignored, ...remainingErrors } = current;
          return remainingErrors;
        });
      }
      ready(path);
    };
    const unsubscribers = [
      subscribeCalls([], received('calls', setCalls), failed('calls')),
      subscribeTechnicians([], received('technicians', setTechnicians), failed('technicians')),
      subscribeCompanies([], received('companies', setCompanies), failed('companies')),
      subscribeLines([], received('lines', setLines), failed('lines')),
      subscribeProblems([], received('problems', setProblems), failed('problems')),
      subscribeUsers([], received('users', setUsers), failed('users')),
    ];
    return () => { active = false; unsubscribers.forEach(unsubscribe => unsubscribe()); };
  }, []);

  const liveModules = useMemo(() => {
    const bySlug: Record<string, PortalModule> = {};
    const callRows = calls.map(call => [text(call.callNumber ?? call.line ?? call.problem), text(call.problem), text(call.line), text(call.priority), statusLabel(call.status), formatDateTime(call.createdTime ?? call.date, locale)]);
    bySlug['is-kvietimai'] = { ...demoModules[0], rows: callRows };
    bySlug['gyvi-is-kvietimai'] = { ...demoModules[1], rows: calls.filter(call => call.status !== 'completed').map(call => [text(call.callNumber ?? call.line ?? call.problem), text(call.problem), text(call.line), text(call.priority), statusLabel(call.status), formatDateTime(call.createdTime ?? call.date, locale)]) };
    bySlug.istorija = { ...demoModules[2], rows: calls.filter(call => call.status === 'completed').sort((a, b) => Number(b.completedTime ?? 0) - Number(a.completedTime ?? 0)).map(call => [text(call.callNumber ?? call.line ?? call.problem), text(call.problem), text(call.line), text(call.priority), statusLabel(call.status), formatDateTime(call.completedTime, locale)]) };
    bySlug.technikai = { ...demoModules.find(item => item.slug === 'technikai')!, rows: technicians.map(item => [text(item.name ?? item.email), text(item.name), text(item.lines), '—', item.active === false ? 'Neaktyvus' : 'Aktyvus', text(item.email)]) };
    bySlug.operatoriai = { ...demoModules.find(item => item.slug === 'operatoriai')!, rows: operators.map(item => [text(item.name ?? item.email), text(item.name), '—', '—', item.active === false ? 'Neaktyvus' : 'Aktyvus', text(item.email)]) };
    bySlug.imones = { ...demoModules.find(item => item.slug === 'imones')!, rows: companies.map(item => [text(item.companyCode ?? item.name), text(item.name), text(item.city), '—', 'Aktyvus', text(item.manager)]) };
    bySlug.linijos = { ...demoModules.find(item => item.slug === 'linijos')!, rows: lines.map(item => [text(item.code ?? item.name), text(item.name), '—', '—', item.active === false ? 'Neaktyvus' : 'Aktyvus', '—']) };
    bySlug.gedimai = { ...demoModules.find(item => item.slug === 'gedimai')!, rows: problems.map(item => [text(item.code ?? item.name), text(item.name), text(item.category), '—', item.active === false ? 'Neaktyvus' : 'Aktyvus', '—']) };
    const statistics = demoModules.find(item => item.slug === 'statistika');
    if (statistics) bySlug.statistika = { ...statistics, rows: [['Visi iškvietimai', String(calls.length), '—', '—', 'Aktyvus', 'Visas laikotarpis'], ['Uždaryti iškvietimai', String(calls.filter(call => call.status === 'completed').length), '—', '—', 'Aktyvus', 'Visas laikotarpis']] };
    const usersModule = demoModules.find(item => item.slug === 'vartotojai');
    if (usersModule) bySlug.vartotojai = { ...usersModule, rows: users.map(item => [text(item.name ?? item.email), text(item.name), text(item.email), text(item.role), item.online ? 'Aktyvus' : 'Neaktyvus', item.busy ? 'Užimtas' : '—']) };
    const notifications = demoModules.find(item => item.slug === 'pranesimai');
    if (notifications) bySlug.pranesimai = { ...notifications, rows: tokens.map((item, index) => [`${index + 1}`, 'Registruotas įrenginys', '—', '—', 'Aktyvus', formatDateTime(item.updatedAt, locale)]) };
    return bySlug;
  }, [calls, technicians, operators, companies, lines, problems, users, tokens, locale]);
  return { calls, technicians, operators, companies, lines, problems, users, tokens, preventiveWorks, liveModules, loading, error: false, listenerErrors, configured: isFirebaseConfigured() };
}

/** Protects route access when Firebase is configured without creating data listeners. */
export function PortalAccessGuard({ children }: { children: ReactElement }) {
  const [access, setAccess] = useState(!isFirebaseConfigured());
  const router = useRouter();
  const { userId, initialized } = useAuthContext();
  useEffect(() => {
    if (!isFirebaseConfigured() || !initialized) return;
    let active = true;
    if (!userId) { router.replace('/login'); return () => { active = false; }; }
    void (async () => {
      try { const role = await getUserRole(userId); if (!active) return; if (hasPortalRole(role)) setAccess(true); else { console.error('Firebase user does not have portal role'); router.replace('/login'); } }
      catch (error) { console.error('Firebase role lookup failed', error); router.replace('/login'); }
    })();
    return () => { active = false; };
  }, [initialized, router, userId]);
  if (!access) return <Box sx={{ minHeight: '100vh', bgcolor: '#11161d', color: 'white', display: 'grid', placeItems: 'center', p: 3 }}><Stack spacing={1.5} sx={{ width: 'min(420px, 100%)' }}><Skeleton variant="text" width="46%" height={38} /><Skeleton variant="rounded" height={52} /><Skeleton variant="rounded" height={52} /><Typography variant="body2" color="text.secondary">Tikrinama prieiga…</Typography></Stack></Box>;
  return children;
}
