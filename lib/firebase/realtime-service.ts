import { type Database, DataSnapshot, get, onValue, push, ref, remove, set, update } from 'firebase/database';
import { getFirebaseAuth, getFirebaseDatabase, isFirebaseConfigured } from './firebase-config';
import type { FirebaseId, FirebaseRecord } from '../../types/firebase-models';

export const snapshotToList = <T extends FirebaseRecord>(snapshot: DataSnapshot): T[] => Object.entries(snapshot.val() ?? {}).map(([id, value]) => ({ id, ...(value as Omit<T, 'id'>) } as T));

export function logFirebaseListenerError(path: string, error: Error, database: Database | null = getFirebaseDatabase()) {
  console.error('Firebase listener failed', {
    path,
    authUid: getFirebaseAuth()?.currentUser?.uid ?? null,
    databaseURL: database?.app.options.databaseURL ?? null,
    error,
  });
}

export function subscribeCollection<T extends FirebaseRecord>(path: string, fallback: T[], callback: (items: T[]) => void, onError?: (error: Error) => void) {
  const database = getFirebaseDatabase();
  if (!database || !isFirebaseConfigured()) { callback(fallback); return () => undefined; }
  return onValue(ref(database, path), snapshot => callback(snapshotToList<T>(snapshot)), error => {
    logFirebaseListenerError(path, error, database);
    onError?.(error);
    callback(fallback);
  });
}

export async function deleteRecord(path: string, id: FirebaseId) {
  const database = getFirebaseDatabase();
  if (!database) throw new Error('Firebase is not configured.');
  await remove(ref(database, `${path}/${id}`));
}

export async function getRecord<T extends FirebaseRecord>(path: string, id: FirebaseId): Promise<T | null> {
  const database = getFirebaseDatabase();
  if (!database) throw new Error('Firebase nėra sukonfigūruota.');
  const snapshot = await get(ref(database, `${path}/${id}`));
  return snapshot.exists() ? ({ id, ...(snapshot.val() as Omit<T, 'id'>) } as T) : null;
}

export async function createRecord<T extends FirebaseRecord>(path: string, record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirebaseId> {
  const database = getFirebaseDatabase();
  if (!database) throw new Error('Firebase nėra sukonfigūruota. Įrašykite .env.local reikšmes.');
  const target = push(ref(database, path));
  const now = Date.now();
  await set(target, { ...record, createdAt: now, updatedAt: now });
  if (!target.key) throw new Error('Nepavyko sukurti Firebase identifikatoriaus.');
  return target.key;
}

export async function updateRecord<T extends FirebaseRecord>(path: string, id: FirebaseId, changes: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
  const database = getFirebaseDatabase();
  if (!database) throw new Error('Firebase nėra sukonfigūruota. Įrašykite .env.local reikšmes.');
  await update(ref(database, `${path}/${id}`), { ...changes, updatedAt: Date.now() });
}

export async function saveRecord<T extends FirebaseRecord>(path: string, record: T): Promise<FirebaseId> {
  const database = getFirebaseDatabase();
  if (!database) throw new Error('Firebase is not configured. Add .env.local before saving data.');
  const now = Date.now();
  if (record.id) { await update(ref(database, `${path}/${record.id}`), { ...record, updatedAt: now }); return record.id; }
  const newRef = push(ref(database, path));
  await set(newRef, { ...record, createdAt: now, updatedAt: now });
  return newRef.key as FirebaseId;
}
