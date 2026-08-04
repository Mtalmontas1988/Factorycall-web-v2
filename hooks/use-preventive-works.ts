'use client';

import { useEffect, useState } from 'react';
import { subscribePreventiveWorks } from '../lib/firebase/preventive-works-service';
import type { PreventiveWork } from '../types/firebase-models';

/** Subscribes to /preventiveWorks only while a module needs that data. */
export function usePreventiveWorks(enabled: boolean) {
  const [items, setItems] = useState<PreventiveWork[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) { setLoading(false); return; }
    let active = true;
    setError(null); setLoading(true);
    return subscribePreventiveWorks(
      [],
      data => { if (active) { setItems(data); setLoading(false); } },
      reason => { if (active) { setError(reason.message); setLoading(false); } },
    );
  }, [enabled]);

  return { items, error, loading };
}
