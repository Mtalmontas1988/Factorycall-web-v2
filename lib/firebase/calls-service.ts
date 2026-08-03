import { createRecord, deleteRecord, getRecord, subscribeCollection, updateRecord } from './realtime-service';
import type { FactoryCall } from '../../types/firebase-models';
export const CALLS_PATH = 'calls';
export const subscribeCalls = (fallback: FactoryCall[], callback: (calls: FactoryCall[]) => void, onError?: (error: Error) => void) => subscribeCollection(CALLS_PATH, fallback, callback, onError);
export const getCallById = (id: string) => getRecord<FactoryCall>(CALLS_PATH, id);
export const createCall = (call: Omit<FactoryCall, 'id' | 'createdAt' | 'updatedAt'>) => createRecord<FactoryCall>(CALLS_PATH, call);
export const updateCall = (id: string, changes: Partial<Omit<FactoryCall, 'id' | 'createdAt'>>) => updateRecord<FactoryCall>(CALLS_PATH, id, changes);
export const deleteCall = (id: string) => deleteRecord(CALLS_PATH, id);
