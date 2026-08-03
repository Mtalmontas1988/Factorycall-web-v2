import { deleteRecord, subscribeCollection, saveRecord } from './realtime-service';
import type { ProductionLine } from '../../types/firebase-models';
export const LINES_PATH = 'lines';
export const subscribeLines = (fallback: ProductionLine[], callback: (items: ProductionLine[]) => void, onError?: (error: Error) => void) => subscribeCollection(LINES_PATH, fallback, callback, onError);
export const saveLine = (item: ProductionLine) => saveRecord(LINES_PATH, item);
export const deleteLine = (id: string) => deleteRecord(LINES_PATH, id);
