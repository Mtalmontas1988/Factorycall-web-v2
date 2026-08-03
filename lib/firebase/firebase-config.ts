import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Database, getDatabase } from 'firebase/database';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const isFirebaseConfigured = () => Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.databaseURL && firebaseConfig.projectId && firebaseConfig.appId);
export const getFirebaseApp = (): FirebaseApp | null => isFirebaseConfigured() ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
export const getFirebaseAuth = (): Auth | null => { const app = getFirebaseApp(); return app ? getAuth(app) : null; };
export const getFirebaseDatabase = (): Database | null => { const app = getFirebaseApp(); return app ? getDatabase(app) : null; };
export const getFirebaseStorage = (): FirebaseStorage | null => { const app = getFirebaseApp(); return app ? getStorage(app) : null; };
