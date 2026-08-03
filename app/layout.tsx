import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '../i18n/i18n-provider';

export const metadata: Metadata = { title: 'FactoryCall', description: 'FactoryCall Web Portal', icons: { icon: '/icon.png' } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="lt"><body><I18nProvider>{children}</I18nProvider></body></html>;
}
