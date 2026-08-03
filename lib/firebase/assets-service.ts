import { get, onValue, push, ref, remove, set, update } from 'firebase/database';
import { getFirebaseDatabase } from './firebase-config';
import { logFirebaseListenerError } from './realtime-service';
import type { Asset, AssetStatus } from '../../types/firebase-models';

export const ASSETS_PATH = 'assets';
export type AssetDraft = Omit<Asset, 'id' | 'createdTime' | 'updatedTime' | 'createdAt' | 'updatedAt'>;

const databaseOrThrow = () => {
  const database = getFirebaseDatabase();
  if (!database) throw new Error('Firebase nėra sukonfigūruota. Patikrinkite .env.local failą.');
  return database;
};

const asText = (value: unknown) => typeof value === 'string' ? value : '';
const asStatus = (value: unknown): AssetStatus => value === 'maintenance' || value === 'inactive' ? value : 'active';
const asNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : 0;
const toAsset = (id: string, value: unknown): Asset => {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    id: asText(source.id) || id, company: asText(source.company), line: asText(source.line), name: asText(source.name),
    code: asText(source.code), serialNumber: asText(source.serialNumber), manufacturer: asText(source.manufacturer),
    model: asText(source.model), location: asText(source.location), description: asText(source.description),
    installationDate: asText(source.installationDate), warrantyUntil: asText(source.warrantyUntil), status: asStatus(source.status),
    qrCode: asText(source.qrCode), createdTime: asNumber(source.createdTime), updatedTime: asNumber(source.updatedTime)
  };
};

export const subscribeAssets = (onData: (assets: Asset[]) => void, onError?: (error: Error) => void) => {
  try {
    const database = databaseOrThrow();
    return onValue(ref(database, ASSETS_PATH), snapshot => {
      const raw = snapshot.val();
      const assets = raw && typeof raw === 'object' ? Object.entries(raw as Record<string, unknown>).map(([id, value]) => toAsset(id, value)) : [];
      onData(assets);
    }, error => {
      logFirebaseListenerError(ASSETS_PATH, error, database);
      onError?.(error);
    });
  } catch (error) {
    const reason = error instanceof Error ? error : new Error('Nepavyko prijungti Assets listenerio.');
    logFirebaseListenerError(ASSETS_PATH, reason);
    onError?.(reason);
    return () => undefined;
  }
};

export const getAssetById = async (assetId: string): Promise<Asset | null> => {
  const snapshot = await get(ref(databaseOrThrow(), `${ASSETS_PATH}/${assetId}`));
  return snapshot.exists() ? toAsset(assetId, snapshot.val()) : null;
};

export const createAsset = async (draft: AssetDraft): Promise<string> => {
  const database = databaseOrThrow();
  const target = push(ref(database, ASSETS_PATH));
  if (!target.key) throw new Error('Nepavyko sukurti įrenginio identifikatoriaus.');
  const now = Date.now();
  await set(target, { ...draft, id: target.key, createdTime: now, updatedTime: now });
  return target.key;
};

export const updateAsset = async (assetId: string, updates: Partial<AssetDraft>): Promise<void> => {
  await update(ref(databaseOrThrow(), `${ASSETS_PATH}/${assetId}`), { ...updates, updatedTime: Date.now() });
};

export const deleteAsset = async (assetId: string): Promise<void> => remove(ref(databaseOrThrow(), `${ASSETS_PATH}/${assetId}`));
