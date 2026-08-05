'use client';

import { useMemo, useState } from 'react';
import {
  Close,
  ImageOutlined,
  Search,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { updateCall } from '../lib/firebase/calls-service';
import { StandardDrawer as Drawer } from './standard-overlay';
import { EmptyState } from './empty-state';
import { formatDateTimeForStoredLocale } from '../lib/format-date';
import type { FactoryCall, Technician } from '../types/firebase-models';

type Props = {
  calls: FactoryCall[];
  technicians: Technician[];
};

type StatusFilter = 'all' | 'waiting' | 'repairing' | 'completed';

const statusKey = (value?: string) => {
  const normalized = String(value ?? '').trim().toLocaleLowerCase('lt-LT');
  if (['waiting', 'naujas', 'laukia techniko'].includes(normalized)) return 'waiting';
  if (['repairing', 'vykdomas', 'remontas pradėtas', 'accepted', 'priskirtas'].includes(normalized)) return 'repairing';
  if (['completed', 'užbaigtas', 'uždarytas'].includes(normalized)) return 'completed';
  return normalized || 'waiting';
};

const statusLabel = (value?: string) => ({
  waiting: 'Laukia techniko',
  repairing: 'Vykdomas remontas',
  completed: 'Užbaigtas',
}[statusKey(value)] ?? value ?? 'Nenurodyta');

const priorityTone: Record<string, string> = {
  Kritinis: '#ff6b76',
  Aukštas: '#ffb54c',
  Vidutinis: '#4b9cff',
  Žemas: '#8f9cad',
};

const asTime = (value?: number | string, fallback?: string) => formatDateTimeForStoredLocale(value ?? fallback, fallback || '—');

const callDate = (call: FactoryCall) => {
  const timestamp = Number(call.createdTime ?? call.createdAt ?? 0);
  if (Number.isFinite(timestamp) && timestamp > 0) return new Date(timestamp).toISOString().slice(0, 10);
  return String(call.date ?? '').slice(0, 10);
};

function DetailValue({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{value === undefined || value === null || value === '' ? '—' : String(value)}</Typography>
    </Box>
  );
}

const recordValue = (value: unknown) => {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

export function LiveCallsModule({ calls, technicians }: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [priority, setPriority] = useState('all');
  const [line, setLine] = useState('all');
  const [technician, setTechnician] = useState('all');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<FactoryCall | null>(null);
  const [draftPriority, setDraftPriority] = useState('');
  const [draftStatus, setDraftStatus] = useState('waiting');
  const [draftTechnician, setDraftTechnician] = useState('');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const rowsPerPage = 10;

  const lines = useMemo(() => Array.from(new Set(calls.map(call => call.line).filter(Boolean) as string[])).sort(), [calls]);
  const priorities = useMemo(() => Array.from(new Set(calls.map(call => call.priority).filter(Boolean) as string[])).sort(), [calls]);
  const technicianNames = useMemo(() => Array.from(new Set([...technicians.map(item => item.name), ...calls.map(call => call.technician)].filter(Boolean) as string[])).sort(), [calls, technicians]);

  const filteredCalls = useMemo(() => calls
    .filter(call => {
      const haystack = `${call.id ?? ''} ${call.callNumber ?? ''} ${call.problem ?? ''} ${call.description ?? ''}`.toLocaleLowerCase('lt-LT');
      return (!query || haystack.includes(query.toLocaleLowerCase('lt-LT')))
        && (status === 'all' || statusKey(call.status) === status)
        && (priority === 'all' || call.priority === priority)
        && (line === 'all' || call.line === line)
        && (technician === 'all' || call.technician === technician)
        && (!date || callDate(call) === date);
    })
    .sort((left, right) => Number(right.createdTime ?? right.createdAt ?? 0) - Number(left.createdTime ?? left.createdAt ?? 0)), [calls, date, line, priority, query, status, technician]);

  const visibleCalls = filteredCalls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const openDetails = (call: FactoryCall) => {
    setSelected(call);
    setDraftPriority(String(call.priority ?? 'Vidutinis'));
    setDraftStatus(statusKey(call.status));
    setDraftTechnician(String(call.technician ?? ''));
    setComment('');
  };

  const saveChanges = async () => {
    if (!selected?.id) return;
    setSaving(true);
    setError('');
    try {
      const existingComment = String(selected.technicianComment ?? selected.notes ?? '').trim();
      const appendedComment = comment.trim()
        ? `${existingComment ? `${existingComment}\n\n` : ''}[${formatDateTimeForStoredLocale(Date.now())}] ${comment.trim()}`
        : existingComment;
      await updateCall(selected.id, {
        priority: draftPriority,
        status: draftStatus,
        technician: draftTechnician,
        ...(comment.trim() ? { technicianComment: appendedComment } : {}),
      });
      setSelected(null);
    } catch (reason) {
      console.error('Nepavyko atnaujinti iškvietimo', reason);
      setError('Nepavyko išsaugoti pakeitimų. Patikrinkite prieigą ir bandykite dar kartą.');
    } finally {
      setSaving(false);
    }
  };

  const selectedImages = selected ? [selected.photo, selected.photoAfterRepair, ...(selected.imageUrls ?? []), ...Object.values(selected.attachments ?? {}).map(item => item.url)].filter((item): item is string => Boolean(item)) : [];

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} mb={3}>
        <Box>
          <Typography variant="h4">Gyvi iškvietimai</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Realiu laiku atnaujinamas administratoriaus iškvietimų valdymas</Typography>
        </Box>
        <Chip label={`${filteredCalls.length} iškvietimai`} color="primary" variant="outlined" />
      </Stack>

      <Paper sx={{ p: 2, mb: 2.5, border: '1px solid #293342' }}>
        <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1.25} alignItems={{ xl: 'center' }}>
          <TextField value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Ieškoti pagal ID arba aprašymą" size="small" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xl: 'auto' } }}>
            <FormControl size="small" sx={{ minWidth: 150 }}><Select value={status} onChange={event => { setStatus(event.target.value as StatusFilter); setPage(0); }}><MenuItem value="all">Visos būsenos</MenuItem><MenuItem value="waiting">Laukia</MenuItem><MenuItem value="repairing">Vykdomas</MenuItem><MenuItem value="completed">Užbaigtas</MenuItem></Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 135 }}><Select value={priority} onChange={event => { setPriority(String(event.target.value)); setPage(0); }}><MenuItem value="all">Visi prioritetai</MenuItem>{priorities.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 135 }}><Select value={line} onChange={event => { setLine(String(event.target.value)); setPage(0); }}><MenuItem value="all">Visos linijos</MenuItem>{lines.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}><Select value={technician} onChange={event => { setTechnician(String(event.target.value)); setPage(0); }}><MenuItem value="all">Visi technikai</MenuItem>{technicianNames.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
            <TextField type="date" value={date} onChange={event => { setDate(event.target.value); setPage(0); }} size="small" inputProps={{ 'aria-label': 'Data' }} />
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ border: '1px solid #293342', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 310px)' }}>
          <Table stickyHeader size="small" sx={{ minWidth: 1200 }}>
            <TableHead><TableRow>{['ID', 'Įmonė', 'Linija', 'Gedimo tipas', 'Prioritetas', 'Būsena', 'Operatorius', 'Technikas', 'Sukūrimo laikas'].map(column => <TableCell key={column} sx={{ fontWeight: 750, color: 'text.secondary', borderColor: 'divider', whiteSpace: 'nowrap' }}>{column}</TableCell>)}</TableRow></TableHead>
            <TableBody>{visibleCalls.map(call => <TableRow hover key={call.id} onClick={() => openDetails(call)} sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>{call.callNumber || '—'}</TableCell><TableCell>{call.company || '—'}</TableCell><TableCell>{call.line || '—'}</TableCell><TableCell>{call.problem || call.title || '—'}</TableCell>
              <TableCell><Chip size="small" label={call.priority || 'Nenurodyta'} sx={{ color: priorityTone[String(call.priority)] ?? '#8f9cad', bgcolor: `${priorityTone[String(call.priority)] ?? '#8f9cad'}22` }} /></TableCell>
              <TableCell><Chip size="small" label={statusLabel(call.status)} color={statusKey(call.status) === 'completed' ? 'success' : statusKey(call.status) === 'waiting' ? 'warning' : 'info'} /></TableCell>
              <TableCell>{call.operator || '—'}</TableCell><TableCell>{call.technician || 'Nepriskirtas'}</TableCell><TableCell>{asTime(call.createdTime ?? call.createdAt, call.date)}</TableCell>
            </TableRow>)}</TableBody>
          </Table>
        </TableContainer>
        {!filteredCalls.length && <Box sx={{ p: 2 }}><EmptyState title="Iškvietimų nerasta" description="Pakeiskite filtrus arba paieškos frazę." kind="calls" compact /></Box>}
        <TablePagination component="div" count={filteredCalls.length} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[rowsPerPage]} onPageChange={(_, nextPage) => setPage(nextPage)} labelDisplayedRows={({ from, to, count }) => `${from}–${to} iš ${count}`} />
      </Paper>

      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)} PaperProps={{ sx: { width: { xs: '100%', sm: 560 }, bgcolor: 'background.paper' } }}>
        {selected && <Stack sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, py: 2, borderBottom: '1px solid #293342' }}><Box><Typography variant="h6">Iškvietimo detalės</Typography><Typography variant="caption" color="text.secondary">{selected.callNumber || selected.line || selected.problem || 'Iškvietimas'}</Typography></Box><IconButton onClick={() => setSelected(null)}><Close /></IconButton></Stack>
          <Box sx={{ overflowY: 'auto', p: 2.5, flexGrow: 1 }}>
            <Stack spacing={2.5}>
              <Box><Typography variant="subtitle2" mb={1}>Pagrindinė informacija</Typography><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}><DetailValue label="Iškvietimo numeris" value={selected.callNumber || selected.line || selected.problem} /><DetailValue label="Įmonė" value={selected.company} /><DetailValue label="Linija" value={selected.line} /><DetailValue label="Gedimo tipas" value={selected.problem ?? selected.title} /><DetailValue label="Operatorius / sukūrė" value={selected.operator} /><DetailValue label="Priskirtas technikas" value={selected.technician} /><DetailValue label="Aprašymas" value={selected.description} /><DetailValue label="Komentaras" value={selected.technicianComment ?? selected.notes} /></Box></Box>
              <Divider />
              <Box><Typography variant="subtitle2" mb={1}>Laikai</Typography><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}><DetailValue label="Sukurta" value={asTime(selected.createdTime ?? selected.createdAt, selected.date)} /><DetailValue label="Priimta" value={asTime(selected.acceptedTime)} /><DetailValue label="Atvyko" value={asTime(selected.arrivedTime)} /><DetailValue label="Pradėtas remontas" value={asTime(selected.startedRepairTime)} /><DetailValue label="Užbaigta" value={asTime(selected.completedTime)} /><DetailValue label="Reakcijos laikas" value={selected.responseTime} /><DetailValue label="Remonto laikas" value={selected.repairTime} /><DetailValue label="Prastova" value={selected.totalDowntime} /></Box></Box>
              <Divider />
              <Box><Typography variant="subtitle2" mb={1.25}>Administratoriaus veiksmai</Typography><Stack spacing={1.5}><TextField select label="Prioritetas" size="small" value={draftPriority} onChange={event => setDraftPriority(event.target.value)}><MenuItem value="Žemas">Žemas</MenuItem><MenuItem value="Vidutinis">Vidutinis</MenuItem><MenuItem value="Aukštas">Aukštas</MenuItem><MenuItem value="Kritinis">Kritinis</MenuItem></TextField><TextField select label="Būsena" size="small" value={draftStatus} onChange={event => setDraftStatus(event.target.value)}><MenuItem value="waiting">Laukia techniko</MenuItem><MenuItem value="repairing">Vykdomas remontas</MenuItem><MenuItem value="completed">Užbaigtas</MenuItem></TextField><TextField select label="Technikas" size="small" value={draftTechnician} onChange={event => setDraftTechnician(event.target.value)}><MenuItem value="">Nepriskirtas</MenuItem>{technicianNames.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}</TextField><TextField label="Pridėti komentarą" value={comment} onChange={event => setComment(event.target.value)} multiline minRows={3} placeholder="Komentaras bus įrašytas į esamą techniko komentaro lauką." /></Stack></Box>
              {selectedImages.length > 0 && <Box><Typography variant="subtitle2" mb={1}>Nuotraukos</Typography><Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>{selectedImages.map((url, index) => <Box key={`${url}-${index}`} component="a" href={url} target="_blank" rel="noreferrer" sx={{ width: 120, height: 90, borderRadius: 1.5, overflow: 'hidden', bgcolor: '#202938', display: 'grid', placeItems: 'center' }}><Box component="img" src={url} alt={`Iškvietimo nuotrauka ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Box>)}</Stack></Box>}
              {!selectedImages.length && <Stack direction="row" spacing={1} alignItems="center" color="text.secondary"><ImageOutlined fontSize="small" /><Typography variant="body2">Nuotraukų nėra.</Typography></Stack>}
              <Divider />
              <Box><Typography variant="subtitle2" mb={1}>Papildoma informacija</Typography><Stack spacing={1}>{Object.entries(selected).filter(([key]) => !['id', 'uid', 'companyId', 'lineId', 'technicianId', 'operatorId'].includes(key)).map(([key, value]) => <Box key={key} sx={{ p: 1.25, borderRadius: 1.5, bgcolor: '#202938' }}><Typography variant="caption" color="text.secondary">{key}</Typography><Typography variant="body2" component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: 'inherit' }}>{recordValue(value)}</Typography></Box>)}</Stack></Box>
            </Stack>
          </Box>
          <Stack direction="row" justifyContent="flex-end" spacing={1.25} sx={{ p: 2.5, borderTop: '1px solid #293342' }}><Button onClick={() => setSelected(null)} disabled={saving}>Atšaukti</Button><Button variant="contained" onClick={saveChanges} disabled={saving}>{saving ? 'Saugoma…' : 'Išsaugoti pakeitimus'}</Button></Stack>
        </Stack>}
      </Drawer>

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}><Alert severity="error" onClose={() => setError('')}>{error}</Alert></Snackbar>
    </>
  );
}
