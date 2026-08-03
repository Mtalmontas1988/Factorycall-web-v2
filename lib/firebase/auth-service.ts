import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { getFirebaseAuth, getFirebaseDatabase } from './firebase-config';

export const subscribeToAuth = (callback: (user: User | null) => void) => { const auth = getFirebaseAuth(); return auth ? onAuthStateChanged(auth, callback) : () => undefined; };
export const signIn = async (email: string, password: string) => { const auth = getFirebaseAuth(); if (!auth) throw new Error('Firebase Authentication is not configured.'); return signInWithEmailAndPassword(auth, email, password); };
export const signOutUser = async () => { const auth = getFirebaseAuth(); if (auth) await signOut(auth); };
export const getUserRole = async (uid: string): Promise<string> => { const database = getFirebaseDatabase(); if (!database) return ''; const snapshot = await get(ref(database, `users/${uid}/role`)); return String(snapshot.val() ?? '').trim().toLowerCase(); };
export const hasPortalRole = (role: string) => ['admin', 'administrator', 'vadovas', 'manager'].includes(role.trim().toLowerCase());
