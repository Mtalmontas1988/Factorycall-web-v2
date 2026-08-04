import type { Locale } from '../i18n/i18n-provider';

export type TimestampValue = number | string | null | undefined;

const localeNames: Record<Locale, string> = {
  lt: 'lt-LT', en: 'en-US', pl: 'pl-PL', de: 'de-DE', lv: 'lv-LV', et: 'et-EE', uk: 'uk-UA',
};

export function toDate(value: TimestampValue): Date | null {
  if (value === null || value === undefined || value === '') return null;
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (Number.isFinite(numericValue) && numericValue > 0) return new Date(numericValue);
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) return parsed;
  }
  return null;
}

export function formatDateTime(value: TimestampValue, locale: Locale, fallback = '—'): string {
  const date = toDate(value);
  if (!date) return fallback;
  if (locale === 'lt') return new Intl.DateTimeFormat(localeNames.lt, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date).replace(',', '');
  if (locale === 'en') return new Intl.DateTimeFormat(localeNames.en, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(date).replace(/, (?=\d{1,2}:\d{2}\s[AP]M$)/, ' ');
  return new Intl.DateTimeFormat(localeNames[locale], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
}

export function formatDate(value: TimestampValue, locale: Locale, fallback = '—'): string {
  const date = toDate(value);
  return date ? new Intl.DateTimeFormat(localeNames[locale], { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) : fallback;
}

export function formatRelativeTime(value: TimestampValue, locale: Locale, fallback = '—'): string {
  const date = toDate(value);
  if (!date) return fallback;
  const difference = date.valueOf() - Date.now();
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [['day', 86_400_000], ['hour', 3_600_000], ['minute', 60_000], ['second', 1_000]];
  const [unit, milliseconds] = units.find(([, size]) => Math.abs(difference) >= size) ?? units[units.length - 1];
  return new Intl.RelativeTimeFormat(localeNames[locale], { numeric: 'auto' }).format(Math.round(difference / milliseconds), unit);
}

export function toDateInputValue(value: TimestampValue): string {
  const date = toDate(value);
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatDateTimeForStoredLocale(value: TimestampValue, fallback = '—'): string {
  if (typeof window === 'undefined') return formatDateTime(value, 'lt', fallback);
  const stored = window.localStorage.getItem('factorycall.locale')?.split('-')[0] as Locale | undefined;
  const locale = stored && Object.prototype.hasOwnProperty.call(localeNames, stored) ? stored : 'lt';
  return formatDateTime(value, locale, fallback);
}
