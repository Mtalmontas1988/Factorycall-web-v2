'use client';

import { useMemo, useState } from 'react';
import { DownloadOutlined, PictureAsPdfOutlined, TableChartOutlined } from '@mui/icons-material';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { exportCsv, exportExcel, printPdf, type ReportDocument } from '../lib/report-export';
import { useI18n } from '../i18n/i18n-provider';
import { useActiveCompany } from '../hooks/active-company-context';
import type { Company, FactoryCall, Operator, PreventiveWork, Technician } from '../types/firebase-models';

type ReportKind = 'fault' | 'technicians' | 'kpi' | 'daily' | 'monthly';
type Props = { calls: FactoryCall[]; technicians: Technician[]; operators: Operator[]; companies?: Company[]; preventiveWorks: PreventiveWork[] };
const timestamp = (value?: number | string) => value ? new Date(Number(value)).toLocaleString('lt-LT') : '—';

export function ReportsModule({ calls, technicians, operators, preventiveWorks }: Props) {
  const { t } = useI18n();
  const { companies } = useActiveCompany();
  const [kind, setKind] = useState<ReportKind>('fault');
  const [companyId, setCompanyId] = useState('all');
  const report = useMemo<ReportDocument>(() => {
    const names: Record<ReportKind, string> = { fault: t('reports.fault'), technicians: t('reports.technicians'), kpi: t('reports.kpi'), daily: t('reports.daily'), monthly: t('reports.monthly') };
    const company = companies.find(item => item.id === companyId) ?? companies[0];
    const companyName = company?.name || 'FactoryCall';
    const filteredCalls = companyId === 'all' ? calls : calls.filter(call => call.companyId === companyId || call.company === companyName);
    const base = { title: names[kind], subtitle: 'Ataskaita sugeneruota iš Firebase Realtime Database duomenų.', companyName, companyLogoUrl: company?.logoUrl, reportId: `FC-R-${Date.now()}`, generatedAt: new Date().toLocaleString('lt-LT'), signatureLabel: 'Atsakingo asmens parašas' };
    if (kind === 'technicians') return { ...base, columns: [{ label: 'Technikas', value: '' }, { label: 'El. paštas', value: '' }, { label: 'Aktyvūs iškvietimai', value: '' }, { label: 'Užbaigti iškvietimai', value: '' }], rows: technicians.map(technician => ({ Technikas: technician.name || technician.id || '—', 'El. paštas': technician.email || '—', 'Aktyvūs iškvietimai': filteredCalls.filter(call => call.technicianId === technician.id && call.status !== 'completed').length, 'Užbaigti iškvietimai': filteredCalls.filter(call => call.technicianId === technician.id && call.status === 'completed').length })) };
    if (kind === 'kpi') return { ...base, columns: [{ label: 'Rodiklis', value: '' }, { label: 'Reikšmė', value: '' }], rows: [{ Rodiklis: 'Iškvietimai', Reikšmė: filteredCalls.length }, { Rodiklis: 'Aktyvūs iškvietimai', Reikšmė: filteredCalls.filter(call => call.status !== 'completed').length }, { Rodiklis: 'Užbaigti iškvietimai', Reikšmė: filteredCalls.filter(call => call.status === 'completed').length }, { Rodiklis: 'Technikai', Reikšmė: technicians.length }, { Rodiklis: 'Operatoriai', Reikšmė: operators.length }, { Rodiklis: 'Prevenciniai darbai', Reikšmė: preventiveWorks.length }] };
    const start = kind === 'daily' ? new Date(new Date().setHours(0, 0, 0, 0)).getTime() : kind === 'monthly' ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() : 0;
    const rows = (start ? filteredCalls.filter(call => Number(call.createdTime ?? 0) >= start) : filteredCalls).map(call => ({ ID: call.callNumber || call.id || '—', Įmonė: call.company || companyName, Linija: call.line || '—', Gedimas: call.problem || call.title || '—', Prioritetas: call.priority || '—', Būsena: call.status || '—', Technikas: call.technician || '—', Sukurta: timestamp(call.createdTime ?? call.date) }));
    return { ...base, columns: ['ID', 'Įmonė', 'Linija', 'Gedimas', 'Prioritetas', 'Būsena', 'Technikas', 'Sukurta'].map(label => ({ label, value: '' })), rows };
  }, [calls, companies, companyId, kind, operators.length, preventiveWorks.length, t, technicians]);
  const names: Record<ReportKind, string> = { fault: t('reports.fault'), technicians: t('reports.technicians'), kpi: t('reports.kpi'), daily: t('reports.daily'), monthly: t('reports.monthly') };
  return <Stack spacing={2.5}><Box><Typography variant="h4">{t('reports.title')}</Typography><Typography color="text.secondary" mt={0.5}>{t('reports.subtitle')}</Typography></Box><Paper sx={{ p: 2.5, border: '1px solid #293342' }}><Stack direction={{ xs: 'column', md: 'row' }} spacing={2}><FormControl fullWidth><InputLabel>{t('reports.type')}</InputLabel><Select value={kind} label={t('reports.type')} onChange={event => setKind(event.target.value as ReportKind)}>{Object.entries(names).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</Select></FormControl><FormControl fullWidth><InputLabel>{t('navigation.companies')}</InputLabel><Select value={companyId} label={t('navigation.companies')} onChange={event => setCompanyId(event.target.value)}><MenuItem value="all">{t('reports.allCompanies')}</MenuItem>{companies.map(company => <MenuItem key={company.id} value={company.id}>{company.name || company.id}</MenuItem>)}</Select></FormControl></Stack><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} mt={2.5}><Button variant="contained" startIcon={<PictureAsPdfOutlined />} onClick={() => printPdf(report)}>{t('reports.pdf')}</Button><Button variant="outlined" startIcon={<TableChartOutlined />} onClick={() => exportExcel(report)}>{t('reports.excel')}</Button><Button variant="outlined" startIcon={<DownloadOutlined />} onClick={() => exportCsv(report)}>{t('reports.csv')}</Button></Stack></Paper><Alert severity="info">{t('reports.printHelp')}</Alert><Paper sx={{ p: 2.5, border: '1px solid #293342' }}><Typography fontWeight={700}>{report.title}</Typography><Typography variant="body2" color="text.secondary" mt={0.5}>{t('reports.ready', { count: report.rows.length })}</Typography></Paper></Stack>;
}
