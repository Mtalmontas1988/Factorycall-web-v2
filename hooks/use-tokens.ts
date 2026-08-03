'use client';

import { useEffect, useState } from 'react';
import { subscribeTokens } from '../lib/firebase/tokens-service';
import type { DeviceToken } from '../types/firebase-models';

/** Subscribes to /tokens only while the FCM diagnostics module is open. */
export function useTokens(enabled: boolean) {
  const [items, setItems] = useState<DeviceToken[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setError(null);
    return subscribeTokens(
      [],
      data => { if (active) setItems(data); },
      reason => { if (active) setError(reason.message); },
    );
  }, [enabled]);

  return { items, error };
}
