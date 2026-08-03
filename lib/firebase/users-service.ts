import { deleteRecord, saveRecord, subscribeCollection } from './realtime-service';
import type { PortalUser } from '../../types/firebase-models';
export const USERS_PATH = 'users';
export const subscribeUsers = (fallback: PortalUser[], callback: (items: PortalUser[]) => void, onError?: (error: Error) => void) => subscribeCollection(USERS_PATH, fallback, callback, onError);
export const saveUser = (item: PortalUser) => saveRecord(USERS_PATH, item);
export const deleteUser = (id: string) => deleteRecord(USERS_PATH, id);
