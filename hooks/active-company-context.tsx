'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Company } from '../types/firebase-models';

type ActiveCompanyValue = {
  companies: Company[];
  currentCompanyId: string;
  companyName: string;
  companyLogo: string;
  companySettings: Record<string, unknown>;
  companyLicense: Record<string, unknown>;
  theme: Record<string, unknown>;
  setCurrentCompanyId: (companyId: string) => void;
};

const ActiveCompanyContext = createContext<ActiveCompanyValue | null>(null);

export function ActiveCompanyProvider({ companies, children }: { companies: Company[]; children: ReactNode }) {
  const [currentCompanyId, setCurrentCompanyId] = useState('');
  useEffect(() => {
    if (companies.some(company => company.id === currentCompanyId)) return;
    setCurrentCompanyId(companies[0]?.id ?? '');
  }, [companies, currentCompanyId]);
  const value = useMemo<ActiveCompanyValue>(() => {
    const company = companies.find(item => item.id === currentCompanyId);
    const source = (company ?? {}) as Company & { settings?: Record<string, unknown>; license?: Record<string, unknown>; theme?: Record<string, unknown> };
    return { companies, currentCompanyId, companyName: source.name ?? '', companyLogo: source.logoUrl ?? '', companySettings: source.settings ?? {}, companyLicense: source.license ?? {}, theme: source.theme ?? {}, setCurrentCompanyId };
  }, [companies, currentCompanyId]);
  return <ActiveCompanyContext.Provider value={value}>{children}</ActiveCompanyContext.Provider>;
}

export function useActiveCompany(): ActiveCompanyValue {
  const value = useContext(ActiveCompanyContext);
  if (!value) throw new Error('ActiveCompanyProvider is missing.');
  return value;
}
