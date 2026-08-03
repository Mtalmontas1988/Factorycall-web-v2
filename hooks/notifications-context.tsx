'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useNotifications } from './use-notifications';

type NotificationsValue = ReturnType<typeof useNotifications>;
const NotificationsContext = createContext<NotificationsValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const value = useNotifications();
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotificationsContext(): NotificationsValue {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error('NotificationsProvider nerastas.');
  return value;
}
