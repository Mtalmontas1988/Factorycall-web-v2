'use client';

import { ArrowForwardOutlined } from '@mui/icons-material';
import { Box, Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useI18n } from '../i18n/i18n-provider';
import { formatRelativeTime } from '../lib/format-date';
import type { FactoryCall } from '../types/firebase-models';

export type RecentCallsPanelProps = { calls: FactoryCall[]; onOpenCall?: (call: FactoryCall) => void };
const priorityTone: Record<string, string> = { Kritinis: '#ff6b76', Aukštas: '#ffb54c', Vidutinis: '#4b9cff', Žemas: '#8f9cad' };

export function RecentCallsPanel({ calls, onOpenCall }: RecentCallsPanelProps) {
  const { locale, t } = useI18n();
  const recent = [...calls].sort((a, b) => Number(b.createdTime ?? 0) - Number(a.createdTime ?? 0)).slice(0, 10);
  const statusLabel = (value?: string) => ({ waiting: t('calls.new'), accepted: t('calls.assigned'), repairing: t('calls.inProgress'), completed: t('calls.completed') }[String(value)] ?? value ?? t('common.notSpecified'));
  return <Paper sx={{ p: 2.5, border: '1px solid #293342', minWidth: 0 }}><Typography fontWeight={700}>{t('recentCalls.title')}</Typography><Typography variant="caption" color="text.secondary">{t('recentCalls.subtitle')}</Typography>{!recent.length ? <Typography color="text.secondary" variant="body2" py={4} textAlign="center">{t('recentCalls.empty')}</Typography> : <Stack spacing={1.1} mt={2}>{recent.map(call => { const tone = priorityTone[String(call.priority)] ?? '#8f9cad'; return <Box key={call.id ?? call.callNumber ?? `${call.line}-${call.createdTime}`} onClick={() => onOpenCall?.(call)} sx={{ p: 1.25, borderRadius: 2, border: '1px solid #293342', cursor: onOpenCall ? 'pointer' : 'default', '&:hover': onOpenCall ? { bgcolor: '#202938' } : undefined }}><Stack direction="row" spacing={1} alignItems="flex-start"><Box flexGrow={1} minWidth={0}><Typography variant="body2" fontWeight={700} noWrap>{call.line || t('recentCalls.unnamedLine')}</Typography><Typography variant="caption" color="text.secondary" noWrap>{call.problem || call.title || t('recentCalls.unnamedFault')}</Typography></Box><Chip size="small" label={call.priority || t('common.notSpecified')} sx={{ color: tone, bgcolor: `${tone}22`, flexShrink: 0 }} /><IconButton size="small" aria-label={t('recentCalls.open')}><ArrowForwardOutlined fontSize="small" /></IconButton></Stack><Stack direction="row" justifyContent="space-between" mt={.75}><Typography variant="caption" color="text.secondary">{call.technician || t('recentCalls.unassignedTechnician')} · {statusLabel(call.status)}</Typography><Typography variant="caption" color="text.secondary">{formatRelativeTime(call.createdTime ?? call.date, locale, t('common.notSpecified'))}</Typography></Stack></Box>; })}</Stack>}</Paper>;
}
