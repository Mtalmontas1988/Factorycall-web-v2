'use client';

import { BuildOutlined, CheckCircleOutline, EngineeringOutlined, PendingActionsOutlined, PrecisionManufacturingOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useI18n } from '../i18n/i18n-provider';
import type { FactoryCall, PreventiveWork, ProductionLine, Technician } from '../types/firebase-models';

export type DashboardStatisticsProps = { calls: FactoryCall[]; technicians: Technician[]; preventiveWorks: PreventiveWork[]; lines: ProductionLine[]; onNavigate?: (path: string) => void };
const isToday = (value?: number) => Boolean(value && new Date(value).toDateString() === new Date().toDateString());

export function DashboardStatistics({ calls, technicians, preventiveWorks, lines, onNavigate }: DashboardStatisticsProps) {
  const { t } = useI18n();
  const activeCalls = calls.filter(call => call.status !== 'completed').length;
  const waitingCalls = calls.filter(call => call.status === 'waiting').length;
  const activeTechnicians = technicians.filter(technician => technician.active !== false).length;
  const completedToday = calls.filter(call => call.status === 'completed' && isToday(call.completedTime)).length;
  const preventiveToday = preventiveWorks.filter(work => isToday(Number(work.dueTime ?? work.scheduledTime ?? 0)) && work.status !== 'completed').length;
  const cards = [[t('dashboard.activeFaults'), activeCalls, '#ff6b76', WarningAmberOutlined, '/is-kvietimai'], [t('statistics.waiting'), waitingCalls, '#ffb54c', PendingActionsOutlined, '/is-kvietimai'], [t('statistics.activeTechnicians'), activeTechnicians, '#38d996', EngineeringOutlined, '/technikai'], [t('dashboard.completedToday'), completedToday, '#4b9cff', CheckCircleOutline, '/istorija'], [t('statistics.preventiveToday'), preventiveToday, '#aa7dff', BuildOutlined, '/prevenciniai-darbai'], [t('statistics.lines'), lines.filter(line => line.active !== false).length, '#edf3fb', PrecisionManufacturingOutlined, '/linijos']] as const;
  return <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 2, mb: 2.5, '@media (max-width: 1500px)': { gridTemplateColumns: 'repeat(3, 1fr)' }, '@media (max-width: 760px)': { gridTemplateColumns: 'repeat(2, 1fr)' }, '@media (max-width: 430px)': { gridTemplateColumns: '1fr' } }}>{cards.map(([title, value, tone, Icon, path]) => <Paper component="button" key={title} onClick={() => onNavigate?.(path)} sx={{ p: 2.25, minWidth: 0, textAlign: 'left', color: 'text.primary', bgcolor: 'background.paper', border: '1px solid #293342', cursor: onNavigate ? 'pointer' : 'default', transition: 'transform 160ms ease, border-color 160ms ease', '&:hover': onNavigate ? { transform: 'translateY(-2px)', borderColor: tone } : undefined }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="body2" color="text.secondary" fontWeight={700}>{title}</Typography><Icon sx={{ color: tone }} /></Stack><Typography variant="h4" mt={1} letterSpacing={-1}>{value}</Typography></Paper>)}</Box>;
}
