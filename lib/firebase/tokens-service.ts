import { subscribeCollection } from './realtime-service';
import type { DeviceToken } from '../../types/firebase-models';
export const TOKENS_PATH = 'tokens';
export const subscribeTokens = (fallback: DeviceToken[], callback: (items: DeviceToken[]) => void, onError?: (error: Error) => void) => subscribeCollection(TOKENS_PATH, fallback, callback, onError);
