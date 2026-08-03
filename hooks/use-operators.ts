'use client';

import { useEffect, useState } from 'react';
import { subscribeOperators } from '../lib/firebase/operators-service';
import type { Operator } from '../types/firebase-models';

/** Subscribes to /operators only while the Operators module is open. */
export function useOperators(enabled: boolean, fallback: Operator[] = []) {
  const [operators, setOperators] = useState<Operator[]>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setError(null);
    return subscribeOperators(
      [],
      items => { if (active) setOperators(items); },
      reason => { if (active) setError(reason.message); },
    );
  }, [enabled]);

  return { operators, error };
}
