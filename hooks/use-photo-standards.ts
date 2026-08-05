'use client';

import { useEffect, useState } from 'react';
import { subscribePhotoStandardCategories, subscribePhotoStandardProducts } from '../lib/firebase/photo-standards-service';
import { useAuthContext } from './auth-context';
import type { PhotoStandardCategory, PhotoStandardProduct } from '../types/firebase-models';

export function usePhotoStandards() {
  const { initialized, userId } = useAuthContext();
  const [categories, setCategories] = useState<PhotoStandardCategory[]>([]);
  const [products, setProducts] = useState<PhotoStandardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) { setLoading(true); return; }
    if (!userId) { setCategories([]); setProducts([]); setLoading(false); return; }
    let active = true;
    let pending = 2;
    const complete = () => { pending -= 1; if (active && pending === 0) setLoading(false); };
    setLoading(true); setError(null);
    const categoryStop = subscribePhotoStandardCategories(items => { if (active) setCategories(items); complete(); }, reason => { if (active) setError(reason.message); complete(); });
    const productStop = subscribePhotoStandardProducts(items => { if (active) setProducts(items); complete(); }, reason => { if (active) setError(reason.message); complete(); });
    return () => { active = false; categoryStop(); productStop(); };
  }, [initialized, userId]);

  return { categories, products, loading, error };
}
