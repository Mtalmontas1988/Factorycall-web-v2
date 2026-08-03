import { deleteRecord, subscribeCollection, saveRecord, updateRecord } from './realtime-service';
import type { Technician } from '../../types/firebase-models';
export const TECHNICIANS_PATH = 'technicians';
export const subscribeTechnicians = (fallback: Technician[], callback: (items: Technician[]) => void, onError?: (error: Error) => void) => subscribeCollection(TECHNICIANS_PATH, fallback, callback, onError);
export const saveTechnician = (item: Technician) => saveRecord(TECHNICIANS_PATH, item);
export const updateTechnician = (id: string, changes: Partial<Omit<Technician, 'id' | 'createdAt'>>) => updateRecord<Technician>(TECHNICIANS_PATH, id, changes);
export const deleteTechnician = (id: string) => deleteRecord(TECHNICIANS_PATH, id);
