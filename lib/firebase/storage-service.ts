import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFirebaseStorage } from './firebase-config';

/** Keeps Android storage paths untouched: callers provide the original path. */
export async function uploadAtStoragePath(path: string, file: File) {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage is not configured.');
  const target = ref(storage, path);
  await uploadBytes(target, file);
  return getDownloadURL(target);
}

export const isPhotoUrl = (value?: string) => Boolean(value && /^https?:\/\//i.test(value));

/** Deletes only Firebase Storage URLs; external company logos are never touched. */
export async function deleteManagedStorageUrl(url?: string) {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return false;
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage is not configured.');
  await deleteObject(ref(storage, url));
  return true;
}
