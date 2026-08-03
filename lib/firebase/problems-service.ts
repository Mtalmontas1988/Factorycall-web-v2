import { deleteRecord, subscribeCollection, saveRecord } from './realtime-service';
import type { Problem } from '../../types/firebase-models';
export const PROBLEMS_PATH = 'problems';
export const subscribeProblems = (fallback: Problem[], callback: (items: Problem[]) => void, onError?: (error: Error) => void) => subscribeCollection(PROBLEMS_PATH, fallback, callback, onError);
export const saveProblem = (item: Problem) => saveRecord(PROBLEMS_PATH, item);
export const deleteProblem = (id: string) => deleteRecord(PROBLEMS_PATH, id);
