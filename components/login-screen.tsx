'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockOutlined } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, CssBaseline, Paper, Stack, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useI18n } from '../i18n/i18n-provider';
import { getUserRole, hasPortalRole, signIn, signOutUser } from '../lib/firebase/auth-service';
import { isFirebaseConfigured } from '../lib/firebase/firebase-config';
import { BrandLogo } from './brand-logo';
import { LanguageSelector } from './language-selector';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { t } = useI18n();
  const submit = async () => {
    if (!isFirebaseConfigured()) { router.replace('/'); return; }
    if (!email || !password) { setMessage(t('login.required')); return; }
    setLoading(true); setMessage('');
    try {
      const result = await signIn(email, password);
      const role = await getUserRole(result.user.uid);
      if (!hasPortalRole(role)) { await signOutUser(); setMessage(t('login.noAccess')); return; }
      router.replace('/');
    } catch (error) {
      console.error('Firebase login failed', error);
      setMessage(t('login.failed'));
    } finally { setLoading(false); }
  };
  const theme = createTheme({ palette: { mode: 'dark', primary: { main: '#4b9cff' }, background: { default: '#11161d', paper: '#181f29' } }, shape: { borderRadius: 14 }, typography: { fontFamily: 'Inter, Roboto, Arial, sans-serif' }, components: { MuiButton: { styleOverrides: { root: { minHeight: 44, borderRadius: 9, textTransform: 'none', fontWeight: 700 } } }, MuiTextField: { defaultProps: { size: 'small' } }, MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } } } });
  return <ThemeProvider theme={theme}><CssBaseline /><Box sx={{ minHeight: '100vh', p: 2, background: 'radial-gradient(circle at 20% 8%, #1e4169 0%, transparent 34%), #11161d' }}><Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: { xs: 2, sm: 0 } }}><LanguageSelector /></Box><Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'grid', placeItems: 'center' }}><Paper sx={{ width: '100%', maxWidth: 430, p: { xs: 3, sm: 4 }, border: '1px solid #2d3949', boxShadow: '0 24px 80px #0008' }}><Stack spacing={2.5}><BrandLogo width={255} /><Box><Typography variant="h5" fontWeight={800}>{t('login.welcome')}</Typography><Typography variant="body2" color="text.secondary" mt={0.5}>{t('login.subtitle')}</Typography></Box>{message && <Alert severity="error">{message}</Alert>}<TextField label={t('login.email')} type="email" value={email} onChange={event => setEmail(event.target.value)} fullWidth /><TextField label={t('login.password')} type="password" value={password} onChange={event => setPassword(event.target.value)} onKeyDown={event => event.key === 'Enter' && submit()} fullWidth /><Button onClick={submit} disabled={loading} size="large" variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockOutlined />} sx={{ py: 1.25 }}>{isFirebaseConfigured() ? t('login.submit') : t('login.demo')}</Button><Typography variant="caption" align="center" color="text.secondary">{isFirebaseConfigured() ? t('portal.database') : t('login.demoMode')}</Typography></Stack></Paper></Box></Box></ThemeProvider>;
}
