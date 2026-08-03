'use client';

import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { subscribeCalls } from '../lib/firebase/calls-service';
import { subscribeCompanies } from '../lib/firebase/companies-service';
import { isFirebaseConfigured } from '../lib/firebase/firebase-config';
import { subscribeLines } from '../lib/firebase/lines-service';
import { subscribeOperators } from '../lib/firebase/operators-service';
import { subscribeProblems } from '../lib/firebase/problems-service';
import { subscribePreventiveWorks } from '../lib/firebase/preventive-works-service';
import { subscribeTechnicians } from '../lib/firebase/technicians-service';
import { subscribeTokens } from '../lib/firebase/tokens-service';
import { subscribeUsers } from '../lib/firebase/users-service';
import { subscribeAssets } from '../lib/firebase/assets-service';
import { getUserRole, hasPortalRole } from '../lib/firebase/auth-service';
import { useAuthContext } from './auth-context';
import { modules as demoModules } from '../components/mock-data';
import type { PortalModule } from '../components/portal-types';
import type { Asset, Company, DeviceToken, FactoryCall, Operator, PortalUser, PreventiveWork, Problem, ProductionLine, Technician } from '../types/firebase-models';

const text = (value?: string | number | null) => value === undefined || value === null || value === '' ? '—' : String(value);
const statusLabel = (value?: string) => ({ waiting: 'Naujas', accepted: 'Priskirtas', repairing: 'Vykdomas', completed: 'Uždarytas' }[value ?? ''] ?? value ?? '—');

export function useFactoryData() {
  const [calls, setCalls] = useState<FactoryCall[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [tokens, setTokens] = useState<DeviceToken[]>([]);
  const [preventiveWorks, setPreventiveWorks] = useState<PreventiveWork[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) { setLoading(false); return; }
    let active = true; let remaining = 10;
    const ready = () => { remaining -= 1; if (active && remaining <= 0) setLoading(false); };
    const failed = () => { if (active) setError(true); ready(); };
    const unsubscribers = [subscribeCalls([], items => { if (active) setCalls(items); ready(); }, failed), subscribeTechnicians([], items => { if (active) setTechnicians(items); ready(); }, failed), subscribeOperators([], items => { if (active) setOperators(items); ready(); }, failed), subscribeCompanies([], items => { if (active) setCompanies(items); ready(); }, failed), subscribeLines([], items => { if (active) setLines(items); ready(); }, failed), subscribeProblems([], items => { if (active) setProblems(items); ready(); }, failed), subscribeUsers([], items => { if (active) setUsers(items); ready(); }, failed), subscribeTokens([], items => { if (active) setTokens(items); ready(); }, failed), subscribePreventiveWorks([], items => { if (active) setPreventiveWorks(items); ready(); }, failed), subscribeAssets(items => { if (active) setAssets(items); ready(); }, failed)];
    return () => { active = false; unsubscribers.forEach(unsubscribe => unsubscribe()); };
  }, []);

  const liveModules = useMemo(() => {
    const bySlug: Record<string, PortalModule> = {};
    const callRows = calls.map(call => [text(call.callNumber ?? call.id), text(call.problem), text(call.line), text(call.priority), statusLabel(call.status), text(call.date ?? call.createdTime)]);
    bySlug['is-kvietimai'] = { ...demoModules[0], rows: callRows };
    bySlug['gyvi-is-kvietimai'] = { ...demoModules[1], rows: calls.filter(call => call.status !== 'completed').map(call => [text(call.callNumber ?? call.id), text(call.problem), text(call.line), text(call.priority), statusLabel(call.status), text(call.createdTime ?? call.date)]) };
    bySlug.istorija = { ...demoModules[2], rows: calls.filter(call => call.status === 'completed').sort((a, b) => Number(b.completedTime ?? 0) - Number(a.completedTime ?? 0)).map(call => [text(call.callNumber ?? call.id), text(call.problem), text(call.line), text(call.priority), statusLabel(call.status), text(call.completedTime)]) };
    bySlug.technikai = { ...demoModules.find(item => item.slug === 'technikai')!, rows: technicians.map(item => [text(item.id), text(item.name), text(item.lines), '—', item.active === false ? 'Neaktyvus' : 'Aktyvus', text(item.email)]) };
    bySlug.operatoriai = { ...demoModules.find(item => item.slug === 'operatoriai')!, rows: operators.map(item => [text(item.id), text(item.name), '—', '—', item.active === false ? 'Neaktyvus' : 'Aktyvus', text(item.email)]) };
    bySlug.imones = { ...demoModules.find(item => item.slug === 'imones')!, rows: companies.map(item => [text(item.companyCode ?? item.id), text(item.name), text(item.city), '—', 'Aktyvus', text(item.manager)]) };
    bySlug.linijos = { ...demoModules.find(item => item.slug === 'linijos')!, rows: lines.map(item => [text(item.id), text(item.name), '—', '—', item.active === false ? 'Neaktyvus' : 'Aktyvus', '—']) };
    bySlug.gedimai = { ...demoModules.find(item => item.slug === 'gedimai')!, rows: problems.map(item => [text(item.id), text(item.name), text(item.category), '—', item.active === false ? 'Neaktyvus' : 'Aktyvus', '—']) };
    const statistics = demoModules.find(item => item.slug === 'statistika');
    if (statistics) bySlug.statistika = { ...statistics, rows: [['Visi iškvietimai', String(calls.length), '—', '—', 'Aktyvus', 'Visas laikotarpis'], ['Uždaryti iškvietimai', String(calls.filter(call => call.status === 'completed').length), '—', '—', 'Aktyvus', 'Visas laikotarpis']] };
    const usersModule = demoModules.find(item => item.slug === 'vartotojai');
    if (usersModule) bySlug.vartotojai = { ...usersModule, rows: users.map(item => [text(item.id), text(item.name), text(item.email), text(item.role), item.online ? 'Aktyvus' : 'Neaktyvus', item.busy ? 'Užimtas' : '—']) };
    const notifications = demoModules.find(item => item.slug === 'pranesimai');
    if (notifications) bySlug.pranesimai = { ...notifications, rows: tokens.map(item => [text(item.id), 'Registruotas įrenginys', text(item.userId), '—', 'Aktyvus', text(item.updatedAt)]) };
    return bySlug;
  }, [calls, technicians, operators, companies, lines, problems, users, tokens]);
  return { calls, technicians, operators, companies, lines, problems, users, tokens, preventiveWorks, assets, liveModules, loading, error, configured: isFirebaseConfigured() };
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
  if (!access) return <Box sx={{ minHeight: '100vh', bgcolor: '#11161d', color: 'white', display: 'grid', placeItems: 'center', gap: 1 }}><Box textAlign="center"><CircularProgress/><Typography mt={2}>Tikrinama prieiga…</Typography></Box></Box>;
  return children;
}
