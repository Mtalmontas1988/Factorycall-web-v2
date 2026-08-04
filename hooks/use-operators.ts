'use client';

import { useEffect, useState } from 'react';
import { subscribeOperators } from '../lib/firebase/operators-service';
import type { Operator } from '../types/firebase-models';

/** Subscribes to /operators only while the Operators module is open. */
export function useOperators(enabled: boolean, fallback: Operator[] = []) {
  const [operators, setOperators] = useState<Operator[]>(fallback);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) { setLoading(false); return; }
    let active = true;
    setError(null); setLoading(true);
    return subscribeOperators(
      [],
      items => { if (active) { setOperators(items); setLoading(false); } },
      reason => { if (active) { setError(reason.message); setLoading(false); } },
    );
  }, [enabled]);

  return { operators, error, loading };
}
