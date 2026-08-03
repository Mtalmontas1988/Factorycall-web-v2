'use client';

import { Add, AssignmentLateOutlined, BuildOutlined, CheckCircleOutline, EngineeringOutlined, PlayCircleOutline, TimerOutlined } from '@mui/icons-material';
import { Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useI18n } from '../i18n/i18n-provider';
import { useNotificationsContext } from '../hooks/notifications-context';
import type { FactoryCall, Operator, PreventiveWork, Technician } from '../types/firebase-models';
import type { PortalModule } from './portal-types';

type Props = { calls: FactoryCall[]; technicians: Technician[]; operators: Operator[]; preventiveWorks: PreventiveWork[]; callsModule: PortalModule; onCreate: () => void };
const numberFrom = (value?: string) => Number(String(value ?? '').replace(',', '.').match(/[\d.]+/)?.[0] ?? 0);
const today = (value?: number) => Boolean(value && new Date(value).toDateString() === new Date().toDateString());
const normalizedStatus = (value?: string) => String(value ?? '').trim().toLocaleLowerCase('lt-LT');
const isCompleted = (value?: string) => ['completed', 'užbaigtas', 'uždarytas'].includes(normalizedStatus(value));
const isWaiting = (value?: string) => ['waiting', 'naujas', 'laukia techniko'].includes(normalizedStatus(value));
const isRepairing = (value?: string) => ['repairing', 'vykdomas', 'remontas pradėtas'].includes(normalizedStatus(value));
const priorityColor: Record<string, string> = { Kritinis: '#ff6b76', Aukštas: '#ffb54c', Vidutinis: '#4b9cff', Žemas: '#8f9cad' };

function Kpi({ title, value, Icon, tone, href, onNavigate }: { title: string; value: string; Icon: typeof Add; tone: string; href: string; onNavigate: (path: string) => void }) {
  return <Paper component="button" onClick={() => onNavigate(href)} sx={{ p: 2.25, minWidth: 0, textAlign: 'left', color: 'text.primary', bgcolor: 'background.paper', border: '1px solid #293342', cursor: 'pointer', transition: 'transform 160ms ease, border-color 160ms ease', '&:hover': { transform: 'translateY(-2px)', borderColor: tone } }}><Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary" fontWeight={700}>{title}</Typography><Icon sx={{ color: tone }} /></Stack><Typography variant="h4" mt={1} letterSpacing={-1}>{value}</Typography></Paper>;
}

export function DashboardView({ calls, onCreate }: Props) {
  const router = useRouter();
  const { notifications } = useNotificationsContext();
  const { locale, t } = useI18n();
  const active = calls.filter(call => !isCompleted(call.status)).length;
  const waiting = calls.filter(call => isWaiting(call.status)).length;
  const repairing = calls.filter(call => isRepairing(call.status)).length;
  const completedToday = calls.filter(call => isCompleted(call.status) && today(call.completedTime)).length;
  const avgResponse = calls.length ? Math.round(calls.reduce((sum, call) => sum + numberFrom(call.responseTime), 0) / calls.length) : 0;
  const avgRepair = calls.length ? Math.round(calls.reduce((sum, call) => sum + numberFrom(call.repairTime), 0) / calls.length) : 0;
  const recentCalls = [...calls].sort((a, b) => Number(b.createdTime ?? 0) - Number(a.createdTime ?? 0)).slice(0, 10);
  const recentNotifications = notifications.slice(0, 5);
  const stateLabel = (value?: string) => ({ waiting: t('calls.waitingTechnician'), accepted: t('calls.assigned'), repairing: t('calls.inProgress'), completed: t('calls.completed') }[String(value)] ?? value ?? t('common.notSpecified'));
  const kpis = [
    [t('dashboard.activeFaults'), String(active), AssignmentLateOutlined, '#ff6b76', '/is-kvietimai'],
    [t('dashboard.waitingTechnician'), String(waiting), EngineeringOutlined, '#ffb54c', '/is-kvietimai'],
    [t('dashboard.repairsInProgress'), String(repairing), BuildOutlined, '#4b9cff', '/gyvi-is-kvietimai'],
    [t('dashboard.completedToday'), String(completedToday), CheckCircleOutline, '#38d996', '/istorija'],
    [t('dashboard.averageResponseTime'), t('dashboard.minutes', { count: avgResponse }), TimerOutlined, '#aa7dff', '/statistika'],
    [t('dashboard.averageRepairTime'), t('dashboard.minutes', { count: avgRepair }), PlayCircleOutline, '#4b9cff', '/statistika'],
  ] as const;
  return <>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} mb={3}><Box><Typography variant="h4">{t('dashboard.title')}</Typography><Typography variant="body2" color="text.secondary" mt={0.5}>{t('dashboard.subtitle')}</Typography></Box><Button variant="contained" startIcon={<Add />} onClick={onCreate}>{t('dashboard.newCall')}</Button></Stack>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 2, mb: 2.5, '@media (max-width: 1500px)': { gridTemplateColumns: 'repeat(3, 1fr)' }, '@media (max-width: 760px)': { gridTemplateColumns: 'repeat(2, 1fr)' }, '@media (max-width: 430px)': { gridTemplateColumns: '1fr' } }}>{kpis.map(([title, value, Icon, tone, href]) => <Kpi key={title} title={title} value={value} Icon={Icon} tone={tone} href={href} onNavigate={router.push} />)}</Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(320px, 1fr)' }, gap: 2.5 }}><Paper sx={{ border: '1px solid #293342', overflow: 'hidden' }}><Box p={2.5}><Typography fontWeight={700}>{t('dashboard.recentFaults')}</Typography><Typography variant="caption" color="text.secondary">{t('dashboard.lastTenCalls')}</Typography></Box><Box sx={{ overflowX: 'auto' }}><Table size="small" sx={{ minWidth: 650 }}><TableHead><TableRow>{['dashboard.line', 'dashboard.fault', 'common.priority', 'dashboard.technician', 'common.status', 'dashboard.time'].map(key => <TableCell key={key} sx={{ color: 'text.secondary', fontWeight: 700 }}>{t(key)}</TableCell>)}</TableRow></TableHead><TableBody>{recentCalls.map(call => <TableRow hover key={call.id ?? call.callNumber}><TableCell>{call.line || '—'}</TableCell><TableCell>{call.problem || call.title || '—'}</TableCell><TableCell><Chip size="small" label={call.priority || t('common.notSpecified')} sx={{ color: priorityColor[String(call.priority)] ?? '#8f9cad', bgcolor: `${priorityColor[String(call.priority)] ?? '#8f9cad'}22` }} /></TableCell><TableCell>{call.technician || t('dashboard.unassigned')}</TableCell><TableCell>{stateLabel(call.status)}</TableCell><TableCell>{call.createdTime ? new Date(call.createdTime).toLocaleString(locale) : call.date || '—'}</TableCell></TableRow>)}</TableBody></Table></Box>{!recentCalls.length && <Typography p={4} textAlign="center" color="text.secondary">{t('dashboard.noFaults')}</Typography>}</Paper><Stack spacing={2.5}><Paper sx={{ p: 2.5, border: '1px solid #293342' }}><Stack direction="row" justifyContent="space-between"><Box><Typography fontWeight={700}>{t('dashboard.recentNotifications')}</Typography><Typography variant="caption" color="text.secondary">{t('dashboard.lastEvents')}</Typography></Box><Button size="small" onClick={() => router.push('/pranesimai')}>{t('common.all')}</Button></Stack><Stack spacing={1.25} mt={2}>{recentNotifications.length ? recentNotifications.map(item => <Box key={item.id} onClick={() => router.push('/pranesimai')} sx={{ p: 1.25, borderRadius: 2, cursor: 'pointer', bgcolor: item.read ? 'transparent' : '#1d3048' }}><Typography variant="body2" fontWeight={item.read ? 600 : 800} noWrap>{item.title || t('dashboard.systemNotification')}</Typography><Typography variant="caption" color="text.secondary" noWrap>{item.body || t('dashboard.noAdditionalInformation')}</Typography></Box>) : <Typography variant="body2" color="text.secondary" py={2}>{t('notifications.empty')}</Typography>}</Stack></Paper><Paper sx={{ p: 2.5, border: '1px solid #293342' }}><Typography fontWeight={700}>{t('dashboard.quickActions')}</Typography><Stack spacing={1} mt={2}><Button variant="contained" onClick={onCreate}>{t('dashboard.newCall')}</Button><Button variant="outlined" onClick={() => router.push('/prevenciniai-darbai')}>{t('navigation.preventiveWorks')}</Button><Button variant="outlined" onClick={() => router.push('/pranesimai')}>{t('dashboard.openNotifications')}</Button></Stack></Paper></Stack></Box>
  </>;
}
