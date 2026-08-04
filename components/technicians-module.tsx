'use client';

import { useMemo, useState } from 'react';
import { Close, EngineeringOutlined, Search } from '@mui/icons-material';
import { Alert, Box, Button, Chip, Divider, FormControl, IconButton, InputAdornment, MenuItem, Paper, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { StandardDrawer as Drawer } from './standard-overlay';
import { updateTechnician } from '../lib/firebase/technicians-service';
import type { FactoryCall, PortalUser, Technician } from '../types/firebase-models';
import { formatDateTimeForStoredLocale } from '../lib/format-date';

type Props = { technicians: Technician[]; users: PortalUser[]; calls: FactoryCall[] };
const completed = (status?: string) => ['completed', 'užbaigtas', 'uždarytas'].includes(String(status ?? '').trim().toLocaleLowerCase('lt-LT'));
const activeCall = (status?: string) => !completed(status);
const isToday = (value?: number | string) => { const stamp = Number(value ?? 0); return Number.isFinite(stamp) && stamp > 0 && new Date(stamp).toDateString() === new Date().toDateString(); };
const timestamp = (value?: number | string, fallback?: string) => formatDateTimeForStoredLocale(value ?? fallback, fallback || '—');
const nameOf = (technician: Technician) => technician.name || technician.email || 'Neįvardytas technikas';
const matchesUser = (technician: Technician, user: PortalUser) => Boolean((technician.id && technician.id === user.id) || (technician.uid && technician.uid === user.uid) || (technician.email && user.email && technician.email.toLocaleLowerCase() === user.email.toLocaleLowerCase()));

function Value({ label, value }: { label: string; value?: string | number | null }) {
  return <Box><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{value === undefined || value === null || value === '' ? '—' : String(value)}</Typography></Box>;
}

export function TechniciansModule({ technicians, users, calls }: Props) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('all');
  const [skill, setSkill] = useState('all');
  const [line, setLine] = useState('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Technician | null>(null);
  const [skillsDraft, setSkillsDraft] = useState('');
  const [activeDraft, setActiveDraft] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const rowsPerPage = 10;

  const allSkills = useMemo(() => Array.from(new Set(technicians.flatMap(item => item.skills ?? []))).sort(), [technicians]);
  const allLines = useMemo(() => Array.from(new Set(technicians.flatMap(item => String(item.lines ?? '').split(',').map(value => value.trim()).filter(Boolean)))).sort(), [technicians]);
  const enriched = useMemo(() => technicians.map(technician => {
    const user = users.find(item => matchesUser(technician, item));
    const identifier = technician.id ?? technician.uid ?? '';
    const displayName = nameOf(technician);
    const relatedCalls = calls.filter(call => call.technicianId === identifier || call.technician === displayName || (technician.email && call.technician === technician.email));
    return { technician, user, activeCalls: relatedCalls.filter(call => activeCall(call.status)).length, completedToday: relatedCalls.filter(call => completed(call.status) && isToday(call.completedTime)).length };
  }), [calls, technicians, users]);
  const filtered = useMemo(() => enriched.filter(({ technician }) => {
    const text = `${nameOf(technician)} ${technician.email ?? ''} ${technician.phone ?? ''} ${(technician.skills ?? []).join(' ')} ${technician.lines ?? ''}`.toLocaleLowerCase('lt-LT');
    return (!query || text.includes(query.toLocaleLowerCase('lt-LT')))
      && (active === 'all' || String(technician.active !== false) === active)
      && (skill === 'all' || technician.skills?.includes(skill))
      && (line === 'all' || String(technician.lines ?? '').split(',').map(value => value.trim()).includes(line));
  }), [active, enriched, line, query, skill]);
  const visible = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const selectedUser = selected ? users.find(item => matchesUser(selected, item)) : undefined;
  const selectedCalls = selected ? calls.filter(call => call.technicianId === selected.id || call.technician === nameOf(selected) || (selected.email && call.technician === selected.email)).sort((a, b) => Number(b.createdTime ?? 0) - Number(a.createdTime ?? 0)).slice(0, 10) : [];
  const select = (technician: Technician) => { setSelected(technician); setActiveDraft(technician.active !== false); setSkillsDraft((technician.skills ?? []).join(', ')); };
  const save = async () => {
    if (!selected?.id) return;
    setBusy(true); setError('');
    try {
      const skills = Array.from(new Set(skillsDraft.split(',').map(item => item.trim()).filter(Boolean)));
      await updateTechnician(selected.id, { active: activeDraft, skills });
      setSelected(null);
    } catch (reason) {
      console.error('Nepavyko atnaujinti techniko', reason);
      setError('Nepavyko išsaugoti techniko pakeitimų. Patikrinkite Firebase prieigos teises.');
    } finally { setBusy(false); }
  };

  return <>
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} mb={3}><Box><Typography variant="h4">Technikai</Typography><Typography variant="body2" color="text.secondary" mt={0.5}>Technikų prieinamumas, atsakomybės ir darbo apkrova realiu laiku</Typography></Box><Chip color="primary" variant="outlined" label={`${filtered.length} technikai`} /></Stack>
    <Paper sx={{ p: 2, mb: 2.5, border: '1px solid #293342' }}><Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.25}><TextField size="small" fullWidth value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Ieškoti techniko" InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} /><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}><FormControl size="small" sx={{ minWidth: 145 }}><Select value={active} onChange={event => { setActive(String(event.target.value)); setPage(0); }}><MenuItem value="all">Visi aktyvumai</MenuItem><MenuItem value="true">Aktyvūs</MenuItem><MenuItem value="false">Neaktyvūs</MenuItem></Select></FormControl><FormControl size="small" sx={{ minWidth: 145 }}><Select value={skill} onChange={event => { setSkill(String(event.target.value)); setPage(0); }}><MenuItem value="all">Visos atsakomybės</MenuItem>{allSkills.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl><FormControl size="small" sx={{ minWidth: 145 }}><Select value={line} onChange={event => { setLine(String(event.target.value)); setPage(0); }}><MenuItem value="all">Visos linijos</MenuItem>{allLines.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl></Stack></Stack></Paper>
    <Paper sx={{ border: '1px solid #293342', overflow: 'hidden' }}><TableContainer><Table size="small" sx={{ minWidth: 1050 }}><TableHead><TableRow>{['Vardas', 'El. paštas', 'Būsena', 'Atsakomybės', 'Linijos', 'Paskutinis prisijungimas', 'Aktyvūs iškvietimai', 'Užbaigta šiandien'].map(item => <TableCell key={item} sx={{ fontWeight: 750, color: 'text.secondary', whiteSpace: 'nowrap' }}>{item}</TableCell>)}</TableRow></TableHead><TableBody>{visible.map(({ technician, user, activeCalls, completedToday }) => <TableRow hover key={technician.id} onClick={() => select(technician)} sx={{ cursor: 'pointer' }}><TableCell sx={{ fontWeight: 700 }}>{nameOf(technician)}</TableCell><TableCell>{technician.email ?? user?.email ?? '—'}</TableCell><TableCell><Chip size="small" color={technician.active === false ? 'default' : 'success'} label={technician.active === false ? 'Neaktyvus' : 'Aktyvus'} /></TableCell><TableCell>{(technician.skills ?? []).join(', ') || '—'}</TableCell><TableCell>{technician.lines || '—'}</TableCell><TableCell>{timestamp(technician.lastLoginTime ?? technician.lastLogin ?? user?.lastLoginTime ?? user?.lastLogin)}</TableCell><TableCell><Chip size="small" label={activeCalls} color={activeCalls ? 'warning' : 'default'} /></TableCell><TableCell><Chip size="small" label={completedToday} color={completedToday ? 'success' : 'default'} /></TableCell></TableRow>)}</TableBody></Table></TableContainer>{!filtered.length && <Stack alignItems="center" spacing={1} sx={{ py: 7 }}><EngineeringOutlined color="disabled" sx={{ fontSize: 38 }} /><Typography fontWeight={700}>Technikų nerasta</Typography><Typography variant="body2" color="text.secondary">Pakeiskite filtrus arba paieškos frazę.</Typography></Stack>}<TablePagination component="div" count={filtered.length} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[rowsPerPage]} onPageChange={(_, value) => setPage(value)} labelDisplayedRows={({ from, to, count }) => `${from}–${to} iš ${count}`} /></Paper>
    <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)} PaperProps={{ sx: { width: { xs: '100%', sm: 560 }, bgcolor: 'background.paper' } }}>{selected && <Stack sx={{ height: '100%' }}><Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 2, borderBottom: '1px solid #293342' }}><Box><Typography variant="h6">Techniko profilis</Typography><Typography variant="caption" color="text.secondary">{nameOf(selected)}</Typography></Box><IconButton onClick={() => setSelected(null)}><Close /></IconButton></Stack><Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2.5 }}><Stack spacing={2.5}><Box><Typography variant="subtitle2" mb={1}>Profilis</Typography><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}><Value label="Vardas" value={selected.name} /><Value label="El. paštas" value={selected.email ?? selectedUser?.email} /><Value label="Telefonas" value={selected.phone} /><Value label="Rolė" value={selectedUser?.role} /><Value label="Komanda" value={selected.team} /><Value label="Prieinamumas" value={selected.availability} /></Box></Box><Divider /><Box><Typography variant="subtitle2" mb={1}>Administratoriaus veiksmai</Typography><Stack spacing={1.5}><TextField select label="Būsena" size="small" value={String(activeDraft)} onChange={event => setActiveDraft(event.target.value === 'true')}><MenuItem value="true">Aktyvus</MenuItem><MenuItem value="false">Neaktyvus</MenuItem></TextField><TextField label="Atsakomybės" value={skillsDraft} onChange={event => setSkillsDraft(event.target.value)} helperText="Atsakomybės atskiriamos kableliais." fullWidth /></Stack></Box><Divider /><Box><Typography variant="subtitle2" mb={1}>Paskutiniai iškvietimai</Typography><Stack spacing={1}>{selectedCalls.length ? selectedCalls.map(call => <Paper key={call.id} variant="outlined" sx={{ p: 1.25, borderColor: 'divider' }}><Typography variant="body2" fontWeight={700}>{call.callNumber || call.line || 'Iškvietimas be numerio'} · {call.problem || call.title || 'Gedimas be pavadinimo'}</Typography><Typography variant="caption" color="text.secondary">{call.line || 'Linija nenurodyta'} · {timestamp(call.createdTime, call.date)}</Typography></Paper>) : <Typography variant="body2" color="text.secondary">Iškvietimų nėra.</Typography>}</Stack></Box></Stack></Box><Stack direction="row" justifyContent="flex-end" spacing={1.25} sx={{ p: 2.5, borderTop: '1px solid #293342' }}><Button disabled={busy} onClick={() => setSelected(null)}>Atšaukti</Button><Button variant="contained" disabled={busy} onClick={save}>{busy ? 'Saugoma…' : 'Išsaugoti'}</Button></Stack></Stack>}</Drawer>
    <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}><Alert severity="error" onClose={() => setError('')}>{error}</Alert></Snackbar>
  </>;
}
