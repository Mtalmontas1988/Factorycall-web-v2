'use client';
import { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from './auth-context';
import { subscribeNotifications } from '../lib/firebase/notifications-service';
import type { AppNotification } from '../types/firebase-models';
export function useNotifications() { const { userId, initialized } = useAuthContext(); const [items, setItems] = useState<AppNotification[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); useEffect(() => { if (!initialized) { setLoading(true); return; } if (!userId) { setItems([]); setLoading(false); return; } let active = true; setError(null); setLoading(true); const stop = subscribeNotifications(userId, data => { if (active) { setItems(data); setLoading(false); } }, reason => { if (active) { setError(reason.message); setLoading(false); } }); return () => { active = false; stop(); }; }, [initialized, userId]); const unreadCount = useMemo(() => items.filter(item => !item.read).length, [items]); return { notifications: items, unreadCount, loading, error, userId }; }
