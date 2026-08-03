'use client';
import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Add, Brightness4Outlined, Close, DashboardOutlined, ErrorOutline, FilterListOutlined, Menu, NotificationsNoneOutlined, Search, SortOutlined } from '@mui/icons-material';
import { Alert, AppBar, Avatar, Badge, Box, Button, Chip, CssBaseline, DialogActions, DialogContent, DialogTitle, Drawer, FormControl, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ThemeProvider, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { BrandLogo } from './brand-logo';
import { getModule, modules } from './mock-data';
import type { PortalModule } from './portal-types';
import { useFactoryData } from '../hooks/use-factory-data';
import { DashboardView } from './dashboard-view';
import { AssetsModule } from './assets-module';
import { CompanyManagementModule } from './company-management-module';
import { LiveCallsModule } from './live-calls-module';
import { NotificationsCenter } from './notifications-center';
import { NotificationBell } from './notification-bell';
import { UniversalDialog as Dialog } from './standard-overlay';
import { TechniciansModule } from './technicians-module';
import { ReportsModule } from './reports-module';
import { AdministratorsModule, FcmDiagnosticsModule, LinesManagementModule, OperatorsManagementModule, ProblemsManagementModule, RolesPermissionsModule, StatisticsModule } from './admin-data-modules';
import { useNotificationsContext } from '../hooks/notifications-context';
import { useI18n } from '../i18n/i18n-provider';
import { useActiveCompany } from '../hooks/active-company-context';
import { useOperators } from '../hooks/use-operators';
import { usePreventiveWorks } from '../hooks/use-preventive-works';
import { useTokens } from '../hooks/use-tokens';
import { portalTheme as theme } from '../lib/theme/portal-theme';
const drawerWidth = 260;
const trend = [{ name: 'Pr', value: 21 }, { name: 'An', value: 32 }, { name: 'Tr', value: 26 }, { name: 'Kt', value: 43 }, { name: 'Pn', value: 31 }, { name: 'Št', value: 14 }, { name: 'Sk', value: 18 }];
const status = [{ name: 'Nauji', value: 12, color: '#ffb54c' }, { name: 'Vykdomi', value: 18, color: '#48a4ff' }, { name: 'Laukia dalių', value: 7, color: '#aa7dff' }, { name: 'Uždaryti', value: 63, color: '#38d996' }];
const inactiveModules = new Set(['sandelys', 'prevenciniai-darbai', 'ai']);
const navigationKey = (slug: string) => ({
    'is-kvietimai': 'navigation.calls',
    'gyvi-is-kvietimai': 'navigation.liveCalls',
    istorija: 'navigation.history',
    statistika: 'navigation.statistics',
    ataskaitos: 'navigation.reports',
    technikai: 'navigation.technicians',
    operatoriai: 'navigation.operators',
    imones: 'navigation.companies',
    linijos: 'navigation.lines',
    gedimai: 'navigation.faults',
    irenginiai: 'navigation.assets',
    sandelys: 'navigation.inventory',
    'prevenciniai-darbai': 'navigation.preventiveWorks',
    ai: 'navigation.ai',
    vartotojai: 'navigation.users',
    administratoriai: 'navigation.administrators',
    roles: 'navigation.roles',
    'fcm-diagnostika': 'navigation.fcm',
    pranesimai: 'navigation.notifications',
    nustatymai: 'navigation.settings'
}[slug] ?? 'common.notSpecified');
function StateChip({ value }: {
    value: string;
}) {
    const colors: Record<string, string> = { Naujas: '#ffbf58', Vykdomas: '#75b6ff', Uždarytas: '#60dfaa', Aktyvus: '#60dfaa', 'Laukia dalių': '#bd9aff', Kritinis: '#ff6b76', 'Mažas likutis': '#ffbf58' };
    return <Chip label={value} size="small" sx={{ fontWeight: 700, color: colors[value] ?? '#aab7c8', bgcolor: `${colors[value] ?? '#607089'}22`, borderRadius: 1.5 }}/>;
}
function Metric({ title, value, note, danger }: {
    title: string;
    value: string;
    note: string;
    danger?: boolean;
}) {
    return <Paper sx={{ p: 2.25, border: '1px solid #293342' }}><Stack direction="row" justifyContent="space-between"><Typography variant="body2" color="text.secondary" fontWeight={700}>{title}</Typography><Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: danger ? '#ffb54c' : 'primary.main', mt: .5 }}/></Stack><Typography variant="h4" mt={1} letterSpacing={-1}>{value}</Typography><Typography variant="caption" color={danger ? '#ffbf58' : '#58d7a0'} fontWeight={700}>{note}</Typography></Paper>;
}
function Sidebar({ close, expanded, onExpand }: {
    close: () => void;
    expanded: boolean;
    onExpand: (value: boolean) => void;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { unreadCount } = useNotificationsContext();
    const { t } = useI18n();
    return (
        <Box
            onMouseEnter={() => onExpand(true)}
            onMouseLeave={() => onExpand(false)}
            sx={{ height: '100%', bgcolor: '#151b24', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
            <Box sx={{ minHeight: 76, px: expanded ? 2.25 : 1.25, display: 'flex', alignItems: 'center', justifyContent: expanded ? 'space-between' : 'center' }}>
                {expanded ? <BrandLogo width={190} /> : <BrandLogo compact />}
                {expanded && <IconButton onClick={close} sx={{ display: { md: 'none' } }}><Close /></IconButton>}
            </Box>
            <Box sx={{ px: 1.25 }}>
                <List dense>
                    <Tooltip title={expanded ? '' : t('navigation.dashboard')} placement="right">
                        <ListItemButton onClick={() => router.push('/')} selected={pathname === '/'} sx={{ minHeight: 44, justifyContent: expanded ? 'initial' : 'center', borderRadius: 2, mb: .5, '&.Mui-selected': { bgcolor: '#254b78' } }}>
                            <ListItemIcon sx={{ minWidth: expanded ? 38 : 'auto' }}><DashboardOutlined /></ListItemIcon>
                            {expanded && <ListItemText primary={t('navigation.dashboard')} primaryTypographyProps={{ fontWeight: 700, fontSize: 14 }} />}
                        </ListItemButton>
                    </Tooltip>
                </List>
                {expanded && <Typography variant="overline" sx={{ px: 1.25, color: 'text.secondary', letterSpacing: 1 }}>{t('navigation.management')}</Typography>}
                <List dense>
                    {modules.map(item => {
                        const Icon = item.icon;
                        const badgeCount = item.slug === 'pranesimai' ? unreadCount : 0;
                        return <Tooltip title={expanded ? '' : t(navigationKey(item.slug))} placement="right" key={item.slug}>
                            <ListItemButton onClick={() => router.push(`/${item.slug}`)} selected={pathname === `/${item.slug}`} sx={{ minHeight: 42, justifyContent: expanded ? 'initial' : 'center', borderRadius: 2, color: 'text.secondary', mb: .2, '&.Mui-selected': { bgcolor: '#254b78', color: 'text.primary' }, '&:hover': { bgcolor: '#202938', color: 'text.primary' } }}>
                                <ListItemIcon sx={{ minWidth: expanded ? 38 : 'auto', color: 'inherit', overflow: 'visible' }}>
                                    <Badge badgeContent={badgeCount} color="error" max={99} invisible={badgeCount === 0}>
                                        <Icon fontSize="small" />
                                    </Badge>
                                </ListItemIcon>
                            {expanded && <ListItemText primary={t(navigationKey(item.slug))} primaryTypographyProps={{ fontWeight: 600, fontSize: 13.5 }} />}
                            </ListItemButton>
                        </Tooltip>;
                    })}
                </List>
            </Box>
            {expanded && <Box mt="auto" p={2}><Typography variant="caption" color="text.secondary">{t('portal.database')}</Typography></Box>}
        </Box>
    );
}
function Dashboard({ openDialog, callsModule, callCount, activeCount, completedCount, criticalCount }: {
    openDialog: () => void;
    callsModule: PortalModule;
    callCount: number;
    activeCount: number;
    completedCount: number;
    criticalCount: number;
}) {
    return <><Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2} mb={3}><Box><Typography variant="h4">Dashboard</Typography><Typography variant="body2" color="text.secondary" mt={.5}>Gamybos priežiūros apžvalga · realiu laiku</Typography></Box><Button variant="contained" startIcon={<Add />} onClick={openDialog}>Naujas iškvietimas</Button></Stack><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 2, mb: 2.5, '@media (max-width: 1100px)': { gridTemplateColumns: 'repeat(2,1fr)' }, '@media (max-width: 520px)': { gridTemplateColumns: '1fr' } }}><Metric title="Visi iškvietimai" value={String(callCount)} note="Firebase Realtime Database"/><Metric title="Aktyvūs iškvietimai" value={String(activeCount)} note="Šiuo metu vykdomi"/><Metric title="Uždaryti iškvietimai" value={String(completedCount)} note="status: completed"/><Metric title="Kritiniai gedimai" value={String(criticalCount)} note="Reikalauja dėmesio" danger/></Box><Box sx={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 2.5, mb: 2.5, '@media (max-width: 980px)': { gridTemplateColumns: '1fr' } }}><Paper sx={{ p: 2.5, border: '1px solid #293342' }}><Typography fontWeight={700}>Iškvietimų dinamika</Typography><Typography variant="caption" color="text.secondary">Vizualizacija bus papildyta iš realių `createdTime` duomenų</Typography><Box height={260} mt={1}><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ left: -20, right: 5 }}><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4b9cff" stopOpacity={.4}/><stop offset="1" stopColor="#4b9cff" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8f9cad', fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8f9cad', fontSize: 12 }}/><ChartTooltip contentStyle={{ background: '#202936', border: '1px solid #344255', borderRadius: 10 }}/><Area type="monotone" dataKey="value" stroke="#58a5ff" strokeWidth={3} fill="url(#area)"/></AreaChart></ResponsiveContainer></Box></Paper><Paper sx={{ p: 2.5, border: '1px solid #293342' }}><Typography fontWeight={700}>Gedimų būsenos</Typography><Typography variant="caption" color="text.secondary">Realių įrašų suvestinė</Typography><Stack spacing={1.5} mt={3}><Typography>Aktyvūs: {activeCount}</Typography><Typography>Uždaryti: {completedCount}</Typography><Typography>Kritiniai: {criticalCount}</Typography></Stack></Paper></Box><DataTable module={callsModule} compact/></>;
}
function DataTable({ module, compact }: {
    module: PortalModule;
    compact?: boolean;
}) {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(true);
    const [filter, setFilter] = useState('Visi');
    const rows = useMemo(() => module.rows.filter(row => row.join(' ').toLowerCase().includes(query.toLowerCase()) && (filter === 'Visi' || row.includes(filter))).sort((a, b) => sort ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0])), [module.rows, query, filter, sort]);
    const displayed = compact ? rows.slice(0, 4) : rows.slice(page * 5, page * 5 + 5);
    return <Paper sx={{ border: '1px solid #293342', overflow: 'hidden' }}><Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" spacing={1.5} p={2.5} pb={compact ? 1 : 2}><Box><Typography fontWeight={700}>{compact ? 'Naujausi iškvietimai' : module.label}</Typography><Typography variant="caption" color="text.secondary">{compact ? 'Paskutiniai sistemos atnaujinimai' : `${module.rows.length} įrašai`}</Typography></Box>{!compact && <Stack direction="row" spacing={1}><TextField value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} size="small" placeholder="Ieškoti..." InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small"/></InputAdornment> }}/><FormControl size="small"><Select value={filter} onChange={event => setFilter(String(event.target.value))}><MenuItem value="Visi">Visi</MenuItem><MenuItem value="Naujas">Nauji</MenuItem><MenuItem value="Aktyvus">Aktyvūs</MenuItem><MenuItem value="Uždarytas">Uždaryti</MenuItem></Select></FormControl><Tooltip title="Rūšiuoti"><IconButton onClick={() => setSort(!sort)}><SortOutlined /></IconButton></Tooltip></Stack>}</Stack><TableContainer><Table size="small" sx={{ minWidth: 730 }}><TableHead><TableRow>{module.columns.map(column => <TableCell key={column} sx={{ color: 'text.secondary', fontWeight: 750, fontSize: 11, letterSpacing: .4, textTransform: 'uppercase', borderColor: 'divider' }}>{column}</TableCell>)}</TableRow></TableHead><TableBody>{displayed.map((row, rowIndex) => <TableRow key={`${row[0]}-${rowIndex}`} hover>{row.map((cell, cellIndex) => <TableCell key={cellIndex} sx={{ borderColor: 'divider', whiteSpace: 'nowrap', color: cellIndex === 0 ? 'primary.main' : 'text.primary', fontWeight: cellIndex === 0 ? 750 : 400 }}>{cellIndex === 4 ? <StateChip value={cell}/> : cell}</TableCell>)}</TableRow>)}</TableBody></Table></TableContainer>{!compact && <TablePagination component="div" count={rows.length} page={page} onPageChange={(_, nextPage) => setPage(nextPage)} rowsPerPage={5} rowsPerPageOptions={[5]} labelDisplayedRows={({ from, to, count }) => `${from}–${to} iš ${count}`}/>}</Paper>;
}
function ModulePage({ module, openDialog }: {
    module: PortalModule;
    openDialog: () => void;
}) {
    const [view, setView] = useState<'data' | 'loading' | 'empty' | 'error'>('data');
    return <><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} mb={3}><Box><Typography variant="h4">{module.label}</Typography><Typography variant="body2" color="text.secondary" mt={.5}>{module.description}</Typography></Box><Stack direction="row" spacing={1}><Select size="small" value={view} onChange={event => setView(event.target.value as typeof view)}><MenuItem value="data">Duomenys</MenuItem><MenuItem value="loading">Loading būsena</MenuItem><MenuItem value="empty">Tuščia būsena</MenuItem><MenuItem value="error">Klaidos būsena</MenuItem></Select><Button variant="contained" startIcon={<Add />} onClick={openDialog}>Naujas</Button></Stack></Stack>{view === 'data' && <DataTable module={module}/>}{view === 'loading' && <Paper sx={{ p: 3, border: '1px solid #293342' }}><Stack spacing={2}>{[1, 2, 3, 4].map(item => <Skeleton key={item} variant="rounded" height={48}/>)}</Stack></Paper>}{view === 'empty' && <Paper sx={{ p: 6, border: '1px solid #293342', textAlign: 'center' }}><FilterListOutlined sx={{ fontSize: 42, color: 'text.secondary' }}/><Typography variant="h6" mt={1}>Įrašų nerasta</Typography><Typography variant="body2" color="text.secondary" mt={.5}>Pakeiskite filtrus arba sukurkite pirmą {module.singular}.</Typography><Button variant="outlined" sx={{ mt: 2 }} onClick={openDialog}>Sukurti įrašą</Button></Paper>}{view === 'error' && <Alert severity="error" variant="outlined" icon={<ErrorOutline />}>Nepavyko įkelti demonstracinių duomenų. Bandykite dar kartą arba patikrinkite ryšį.</Alert>}</>;
}
export function PortalShell({ slug, data }: {
    slug?: string;
    data: ReturnType<typeof useFactoryData>;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [dialog, setDialog] = useState(false);
    const desktop = useMediaQuery('(min-width:900px)');
    const { calls, technicians, operators: initialOperators, lines, problems, users, liveModules, loading } = data;
    const needsOperators = ['operatoriai', 'statistika', 'ataskaitos'].includes(slug ?? '');
    const { operators, error: operatorsError } = useOperators(needsOperators, initialOperators);
    const { items: preventiveWorks, error: preventiveWorksError } = usePreventiveWorks(slug === 'ataskaitos');
    const { items: tokens, error: tokensError } = useTokens(slug === 'fcm-diagnostika');
    const { companies } = useActiveCompany();
    const baseModule = slug ? getModule(slug) : undefined;
    const module = slug && baseModule ? (inactiveModules.has(slug) ? { ...baseModule, rows: [] } : liveModules[slug] ?? { ...baseModule, rows: [] }) : undefined;
    const callsModule = liveModules['is-kvietimai'] ?? { ...modules[0], rows: [] };
    const activeCount = calls.filter(call => call.status !== 'completed').length;
    const completedCount = calls.filter(call => call.status === 'completed').length;
    const criticalCount = calls.filter(call => call.priority === 'Kritinis').length;
    const moduleError = slug === 'operatoriai' ? operatorsError : slug === 'ataskaitos' ? preventiveWorksError ?? operatorsError : slug === 'fcm-diagnostika' ? tokensError : null;
    const content = loading ? <Paper sx={{ p: 3 }}><Skeleton variant="rounded" height={48}/><Skeleton variant="rounded" height={48} sx={{ mt: 2 }}/></Paper> : moduleError ? <Alert severity="error">{moduleError}</Alert> : slug === 'ataskaitos' ? <ReportsModule calls={calls} technicians={technicians} operators={operators} companies={companies} preventiveWorks={preventiveWorks} /> : slug === 'gyvi-is-kvietimai' ? <LiveCallsModule calls={calls} technicians={technicians} /> : slug === 'technikai' ? <TechniciansModule technicians={technicians} users={users} calls={calls} /> : slug === 'operatoriai' ? <OperatorsManagementModule operators={operators} users={users} calls={calls} /> : slug === 'imones' ? <CompanyManagementModule companies={companies} /> : slug === 'linijos' ? <LinesManagementModule lines={lines} technicians={technicians} /> : slug === 'gedimai' ? <ProblemsManagementModule problems={problems} /> : slug === 'statistika' ? <StatisticsModule calls={calls} technicians={technicians} operators={operators} /> : slug === 'administratoriai' ? <AdministratorsModule users={users} /> : slug === 'roles' || slug === 'vartotojai' ? <RolesPermissionsModule users={users} /> : slug === 'fcm-diagnostika' ? <FcmDiagnosticsModule tokens={tokens} users={users} /> : slug === 'irenginiai' ? <AssetsModule companies={companies} lines={lines}/> : slug === 'pranesimai' ? <NotificationsCenter /> : inactiveModules.has(slug ?? '') ? <Paper sx={{ p: 6, textAlign: 'center' }}><Typography variant="h6">Modulis ruošiamas</Typography><Typography color="text.secondary" mt={1}>Šiai funkcijai dabartinėje Firebase struktūroje nėra patvirtintos duomenų šakos.</Typography></Paper> : module ? <ModulePage module={module} openDialog={() => setDialog(true)}/> : <DashboardView calls={calls} technicians={technicians} operators={operators} preventiveWorks={preventiveWorks} callsModule={callsModule} onCreate={() => setDialog(true)}/>;
    const drawerWidth = desktop ? (sidebarExpanded ? 260 : 76) : 260;
    return <ThemeProvider theme={theme}><CssBaseline /><Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}><Drawer variant={desktop ? 'permanent' : 'temporary'} open={desktop || mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ width: desktop ? drawerWidth : 0, flexShrink: 0, transition: 'width 180ms ease', '& .MuiDrawer-paper': { width: drawerWidth, overflowX: 'hidden', borderRight: '1px solid #293342', boxSizing: 'border-box', transition: 'width 180ms ease' } }}><Sidebar close={() => setMobileOpen(false)} expanded={desktop ? sidebarExpanded : true} onExpand={setSidebarExpanded}/></Drawer><Box component="main" sx={{ flexGrow: 1, minWidth: 0, width: desktop ? `calc(100% - ${drawerWidth}px)` : '100%' }}><AppBar position="sticky" elevation={0} sx={{ bgcolor: '#11161df5', borderBottom: '1px solid #293342', backdropFilter: 'blur(12px)' }}><Toolbar sx={{ gap: 1.25 }}><IconButton onClick={() => desktop ? setSidebarExpanded(value => !value) : setMobileOpen(true)}><Menu /></IconButton><TextField size="small" placeholder="Ieškoti portale..." sx={{ width: { xs: 'auto', sm: 300 }, flexGrow: { xs: 1, sm: 0 }, '& .MuiOutlinedInput-root': { bgcolor: '#1b232e' } }} InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small"/></InputAdornment> }}/><Box flexGrow={1}/><Tooltip title="Tamsus režimas"><IconButton><Brightness4Outlined /></IconButton></Tooltip><NotificationBell /><Avatar sx={{ width: 34, height: 34, bgcolor: '#365d90', fontSize: 13 }}>MJ</Avatar><Box sx={{ display: { xs: 'none', sm: 'block' } }}><Typography variant="body2" fontWeight={700}>Mantas J.</Typography><Typography variant="caption" color="text.secondary">Administratorius</Typography></Box></Toolbar></AppBar><Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 'none', mx: 'auto' }}>{content}</Box></Box></Box><Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="sm"><DialogTitle>Naujas {module?.singular ?? 'iškvietimas'}</DialogTitle><DialogContent><Stack spacing={2} mt={1}><TextField label="Pavadinimas" fullWidth autoFocus/><TextField label="Aprašymas" fullWidth multiline minRows={3}/><TextField select label="Prioritetas" fullWidth defaultValue="Vidutinis"><MenuItem value="Žemas">Žemas</MenuItem><MenuItem value="Vidutinis">Vidutinis</MenuItem><MenuItem value="Aukštas">Aukštas</MenuItem><MenuItem value="Kritinis">Kritinis</MenuItem></TextField></Stack></DialogContent><DialogActions><Button onClick={() => setDialog(false)}>Atšaukti</Button><Button variant="contained" onClick={() => setDialog(false)}>Išsaugoti</Button></DialogActions></Dialog></ThemeProvider>;
}
