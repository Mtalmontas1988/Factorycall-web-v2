'use client';

import { useState } from 'react';
import { DeleteOutline } from '@mui/icons-material';
import { Alert, Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useActiveCompany } from '../hooks/active-company-context';
import { deleteCompany } from '../lib/firebase/companies-service';
import { deleteManagedStorageUrl } from '../lib/firebase/storage-service';
import type { Company } from '../types/firebase-models';
import { UniversalDialog as Dialog } from './standard-overlay';

export function CompaniesModule() {
  const { companies } = useActiveCompany();
  const [target, setTarget] = useState<Company | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const remove = async () => {
    if (!target?.id) return;
    setBusy(true); setError('');
    try { await deleteManagedStorageUrl(target.logoUrl); await deleteCompany(target.id); setTarget(null); }
    catch (reason) { setError(reason instanceof Error ? `Įmonės pašalinti nepavyko: ${reason.message}` : 'Įmonės pašalinti nepavyko. Įmonė gali turėti susijusių duomenų arba trūksta Firebase teisių.'); }
    finally { setBusy(false); }
  };
  return <><Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}><Box><Typography variant="h4">Įmonės</Typography><Typography color="text.secondary">Įmonių administravimas realiu laiku</Typography></Box></Stack>{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}<Stack spacing={1}>{companies.map(company => <Paper key={company.id} sx={{ p: 2 }}><Stack direction="row" alignItems="center"><Stack sx={{ flexGrow: 1 }}><Typography fontWeight={700}>{company.name || 'Be pavadinimo'}</Typography><Typography variant="body2" color="text.secondary">{company.city || 'Vieta nenurodyta'}</Typography></Stack><IconButton color="error" onClick={() => setTarget(company)}><DeleteOutline /></IconButton></Stack></Paper>)}</Stack>{target && <Dialog open onClose={busy ? undefined : () => setTarget(null)}><DialogTitle>Pašalinti įmonę?</DialogTitle><DialogContent><Typography>Ar tikrai norite pašalinti „{target.name || target.companyCode || 'šią įmonę'}“? Įrašas ir valdomas logotipas bus ištrinti.</Typography></DialogContent><DialogActions><Button disabled={busy} onClick={() => setTarget(null)}>Atšaukti</Button><Button disabled={busy} color="error" variant="contained" onClick={remove}>{busy ? 'Šalinama…' : 'Pašalinti'}</Button></DialogActions></Dialog>}</>;
}
