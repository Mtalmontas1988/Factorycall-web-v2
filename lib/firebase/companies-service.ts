import { deleteRecord, subscribeCollection, saveRecord } from './realtime-service';
import type { Company } from '../../types/firebase-models';
export const COMPANIES_PATH = 'companies';
export const subscribeCompanies = (fallback: Company[], callback: (items: Company[]) => void, onError?: (error: Error) => void) => subscribeCollection(COMPANIES_PATH, fallback, callback, onError);
export const saveCompany = (item: Company) => saveRecord(COMPANIES_PATH, item);
export const deleteCompany = (id: string) => deleteRecord(COMPANIES_PATH, id);
