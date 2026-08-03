'use client';

import { LanguageOutlined } from '@mui/icons-material';
import { MenuItem, Select, Tooltip } from '@mui/material';
import { localeOptions, locales, useI18n } from '../i18n/i18n-provider';

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  return <Tooltip title={t('common.language')}><Select size="small" value={locale} onChange={event => setLocale(event.target.value as typeof locale)} aria-label={t('common.language')} sx={{ minWidth: { xs: 48, sm: 144 }, '& .MuiSelect-select': { py: 0.7, display: 'flex', alignItems: 'center', gap: 0.75 } }} startAdornment={<LanguageOutlined fontSize="small" />}>{locales.map(code => <MenuItem key={code} value={code}>{localeOptions[code].flag} {localeOptions[code].label}</MenuItem>)}</Select></Tooltip>;
}
