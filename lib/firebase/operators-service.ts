import { deleteRecord, subscribeCollection, saveRecord } from './realtime-service';
import type { Operator } from '../../types/firebase-models';
export const OPERATORS_PATH = 'operators';
export const subscribeOperators = (fallback: Operator[], callback: (items: Operator[]) => void, onError?: (error: Error) => void) => subscribeCollection(OPERATORS_PATH, fallback, callback, onError);
export const saveOperator = (item: Operator) => saveRecord(OPERATORS_PATH, item);
export const deleteOperator = (id: string) => deleteRecord(OPERATORS_PATH, id);
