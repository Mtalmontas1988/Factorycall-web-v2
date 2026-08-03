import { getRecord, subscribeCollection } from './realtime-service';
import type { PreventiveWork } from '../../types/firebase-models';
export const PREVENTIVE_WORKS_PATH = 'preventiveWorks';
export const subscribePreventiveWorks = (fallback: PreventiveWork[], callback: (items: PreventiveWork[]) => void, onError?: (error: Error) => void) => subscribeCollection(PREVENTIVE_WORKS_PATH, fallback, callback, onError);
export const getPreventiveWorkById = (id: string) => getRecord<PreventiveWork>(PREVENTIVE_WORKS_PATH, id);
