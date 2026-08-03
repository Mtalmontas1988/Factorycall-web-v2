'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { subscribeToAuth } from '../lib/firebase/auth-service';
import { isFirebaseConfigured } from '../lib/firebase/firebase-config';

type AuthValue = { userId: string; initialized: boolean };
const AuthContext = createContext<AuthValue | null>(null);

/** One shared Firebase Auth subscription for all portal consumers. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState('');
  const [initialized, setInitialized] = useState(!isFirebaseConfigured());
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    return subscribeToAuth(user => { setUserId(user?.uid ?? ''); setInitialized(true); });
  }, []);
  const value = useMemo(() => ({ userId, initialized }), [userId, initialized]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider nerastas.');
  return value;
}
