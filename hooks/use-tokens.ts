'use client';

import { useEffect, useState } from 'react';
import { subscribeTokens } from '../lib/firebase/tokens-service';
import type { DeviceToken } from '../types/firebase-models';

/** Subscribes to /tokens only while the FCM diagnostics module is open. */
export function useTokens(enabled: boolean) {
  const [items, setItems] = useState<DeviceToken[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) { setLoading(false); return; }
    let active = true;
    setError(null); setLoading(true);
    return subscribeTokens(
      [],
      data => { if (active) { setItems(data); setLoading(false); } },
      reason => { if (active) { setError(reason.message); setLoading(false); } },
    );
  }, [enabled]);

  return { items, error, loading };
}
