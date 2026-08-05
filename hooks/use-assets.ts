'use client';

import { useEffect, useState } from 'react';
import { subscribeAssets } from '../lib/firebase/assets-service';
import type { Asset } from '../types/firebase-models';
import { useAuthContext } from './auth-context';

export function useAssets() {
  const { initialized, userId } = useAuthContext();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) { setLoading(true); return; }
    if (!userId) { setAssets([]); setLoading(false); return; }
    let mounted = true;
    setError(null);
    setLoading(true);
    const unsubscribe = subscribeAssets(
      items => { if (mounted) { setAssets(items); setLoading(false); } },
      reason => { if (mounted) { setError(reason.message || 'Nepavyko įkelti įrenginių.'); setLoading(false); } }
    );
    return () => { mounted = false; unsubscribe(); };
  }, [initialized, userId]);

  return { assets, loading, error };
}
