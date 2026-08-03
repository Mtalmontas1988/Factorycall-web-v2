'use client';

import { useEffect, useState } from 'react';
import { subscribePreventiveWorks } from '../lib/firebase/preventive-works-service';
import type { PreventiveWork } from '../types/firebase-models';

/** Subscribes to /preventiveWorks only while a module needs that data. */
export function usePreventiveWorks(enabled: boolean) {
  const [items, setItems] = useState<PreventiveWork[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setError(null);
    return subscribePreventiveWorks(
      [],
      data => { if (active) setItems(data); },
      reason => { if (active) setError(reason.message); },
    );
  }, [enabled]);

  return { items, error };
}
