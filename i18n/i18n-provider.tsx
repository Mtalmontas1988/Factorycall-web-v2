'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import de from '../locales/de/common.json';
import en from '../locales/en/common.json';
import et from '../locales/et/common.json';
import lt from '../locales/lt/common.json';
import lv from '../locales/lv/common.json';
import pl from '../locales/pl/common.json';
import uk from '../locales/uk/common.json';

export const locales = ['lt', 'en', 'pl', 'de', 'lv', 'et', 'uk'] as const;
export type Locale = (typeof locales)[number];
export const localeOptions: Record<Locale, { flag: string; label: string }> = { lt: { flag: '🇱🇹', label: 'Lietuvių' }, en: { flag: '🇬🇧', label: 'English' }, pl: { flag: '🇵🇱', label: 'Polski' }, de: { flag: '🇩🇪', label: 'Deutsch' }, lv: { flag: '🇱🇻', label: 'Latviešu' }, et: { flag: '🇪🇪', label: 'Eesti' }, uk: { flag: '🇺🇦', label: 'Українська' } };
const dictionaries: Record<Locale, Record<string, string>> = { lt, en, pl, de, lv, et, uk };
type InterpolationValues = Record<string, string | number>;
type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: string, values?: InterpolationValues) => string };
const I18nContext = createContext<I18nValue | null>(null);
const storageKey = 'factorycall.locale';
const supported = (value?: string | null): value is Locale => Boolean(value && locales.includes(value.split('-')[0] as Locale));
const missingText = (locale: Locale) => locale === 'en' ? 'Translation unavailable' : 'Vertimas nepasiekiamas';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setCurrentLocale] = useState<Locale>('lt');
  useEffect(() => { const stored = window.localStorage.getItem(storageKey); const browser = navigator.language; if (supported(stored)) setCurrentLocale(stored); else if (supported(browser)) setCurrentLocale(browser.split('-')[0] as Locale); }, []);
  const setLocale = (next: Locale) => { window.localStorage.setItem(storageKey, next); setCurrentLocale(next); };
  const value = useMemo<I18nValue>(() => ({
    locale,
    setLocale,
    t: (key, values) => {
      const message = dictionaries[locale][key] ?? dictionaries.lt[key] ?? missingText(locale);
      return message.replace(/{{(\w+)}}/g, (_, name: string) => String(values?.[name] ?? `{{${name}}}`));
    }
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() { const value = useContext(I18nContext); if (!value) throw new Error('I18nProvider nerastas.'); return value; }
