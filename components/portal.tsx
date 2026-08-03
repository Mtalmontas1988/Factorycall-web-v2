'use client';

import { PortalShell } from './portal-shell';
import { NotificationsProvider } from '../hooks/notifications-context';
import { ActiveCompanyProvider } from '../hooks/active-company-context';
import { useFactoryData } from '../hooks/use-factory-data';

export type PortalProps = {
  slug?: string;
};

/**
 * Plonas įėjimo komponentas. Portalo implementacija laikoma PortalShell,
 * kad pagrindinis maršruto komponentas išliktų skaitomas ir stabilus.
 */
export function Portal({ slug }: PortalProps) {
  const data = useFactoryData();
  return <ActiveCompanyProvider companies={data.companies}><NotificationsProvider><PortalShell slug={slug} data={data} /></NotificationsProvider></ActiveCompanyProvider>;
}
