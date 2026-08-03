import { get, onValue, orderByChild, query, ref, update } from 'firebase/database';
import { getFirebaseDatabase } from './firebase-config';
import { logFirebaseListenerError } from './realtime-service';
import type { AppNotification } from '../../types/firebase-models';
export const NOTIFICATIONS_PATH = 'notifications';
const db = () => { const value = getFirebaseDatabase(); if (!value) throw new Error('Firebase nėra sukonfigūruota.'); return value; };
const read = (id: string, raw: unknown): AppNotification => { const v = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}; const s = (key: string) => typeof v[key] === 'string' ? v[key] : ''; const n = (key: string) => typeof v[key] === 'number' ? v[key] : 0; return { id, eventType: s('eventType'), entityId: s('entityId'), callId: s('callId'), preventiveWorkId: s('preventiveWorkId'), title: s('title'), body: s('body'), recipientUserId: s('recipientUserId'), recipientRole: s('recipientRole'), createdTime: n('createdTime'), read: v.read === true, dismissed: v.dismissed === true, dismissedAt: n('dismissedAt'), source: s('source') }; };
export const subscribeNotifications = (userId: string, onData: (items: AppNotification[]) => void, onError?: (error: Error) => void) => {
  if (!userId) {
    onData([]);
    return () => undefined;
  }

  try {
    const database = db();
    return onValue(
      query(ref(database, NOTIFICATIONS_PATH), orderByChild('recipientUserId')),
      snapshot => {
        const raw = snapshot.val() ?? {};
        onData(
          Object.entries(raw)
            .map(([id, value]) => read(id, value))
            .filter(item => item.recipientUserId === userId && !item.dismissed)
            .sort((a, b) => b.createdTime - a.createdTime),
        );
      },
      error => {
        logFirebaseListenerError(NOTIFICATIONS_PATH, error, database);
        onError?.(error);
      },
    );
  } catch (reason) {
    const error = reason instanceof Error ? reason : new Error('Nepavyko prijungti pranešimų.');
    logFirebaseListenerError(NOTIFICATIONS_PATH, error);
    onError?.(error);
    return () => undefined;
  }
};
export const getNotificationById = async (id: string) => { const snap = await get(ref(db(), `${NOTIFICATIONS_PATH}/${id}`)); return snap.exists() ? read(id, snap.val()) : null; };
export const markNotificationRead = (id: string, readValue = true) => update(ref(db(), `${NOTIFICATIONS_PATH}/${id}`), { read: readValue });
export const markAllNotificationsRead = async (userId: string) => { const snap = await get(query(ref(db(), NOTIFICATIONS_PATH), orderByChild('recipientUserId'))); const changes: Record<string, unknown> = {}; Object.entries(snap.val() ?? {}).forEach(([id, raw]) => { const n = read(id, raw); if (n.recipientUserId === userId && !n.dismissed && !n.read) changes[`${NOTIFICATIONS_PATH}/${id}/read`] = true; }); if (Object.keys(changes).length) await update(ref(db()), changes); };
export const dismissNotification = (id: string) => update(ref(db(), `${NOTIFICATIONS_PATH}/${id}`), { dismissed: true, dismissedAt: Date.now() });
export const dismissReadNotifications = async (userId: string) => { const snap = await get(query(ref(db(), NOTIFICATIONS_PATH), orderByChild('recipientUserId'))); const changes: Record<string, unknown> = {}; Object.entries(snap.val() ?? {}).forEach(([id, raw]) => { const n = read(id, raw); if (n.recipientUserId === userId && n.read && !n.dismissed) { changes[`${NOTIFICATIONS_PATH}/${id}/dismissed`] = true; changes[`${NOTIFICATIONS_PATH}/${id}/dismissedAt`] = Date.now(); } }); if (Object.keys(changes).length) await update(ref(db()), changes); };
