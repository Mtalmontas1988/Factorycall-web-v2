'use client';

import { useEffect, useState } from 'react';
import { subscribeAssets } from '../lib/firebase/assets-service';
import type { Asset } from '../types/firebase-models';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeAssets(
      items => { if (mounted) { setAssets(items); setLoading(false); } },
      reason => { if (mounted) { setError(reason.message || 'Nepavyko įkelti įrenginių.'); setLoading(false); } }
    );
    return () => { mounted = false; unsubscribe(); };
  }, []);

  return { assets, loading, error };
}
