import { deleteManagedStorageUrl, uploadAtStoragePath } from './storage-service';
import { createRecord, deleteRecord, getRecord, subscribeCollection, updateRecord } from './realtime-service';
import type { PhotoStandardCategory, PhotoStandardProduct } from '../../types/firebase-models';

export const PHOTO_STANDARDS_PATH = 'photoStandards';
const categoriesPath = `${PHOTO_STANDARDS_PATH}/categories`;
const productsPath = `${PHOTO_STANDARDS_PATH}/products`;

export const subscribePhotoStandardCategories = (onData: (items: PhotoStandardCategory[]) => void, onError?: (error: Error) => void) =>
  subscribeCollection<PhotoStandardCategory>(categoriesPath, [], items => onData(items.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'lt'))), onError);

export const subscribePhotoStandardProducts = (onData: (items: PhotoStandardProduct[]) => void, onError?: (error: Error) => void) =>
  subscribeCollection<PhotoStandardProduct>(productsPath, [], items => onData(items.sort((a, b) => Number(b.updatedAt ?? 0) - Number(a.updatedAt ?? 0))), onError);

export const getPhotoStandardProduct = (id: string) => getRecord<PhotoStandardProduct>(productsPath, id);
export const createPhotoStandardCategory = (value: Omit<PhotoStandardCategory, 'id' | 'createdAt' | 'updatedAt'>) => createRecord<PhotoStandardCategory>(categoriesPath, value);
export const updatePhotoStandardCategory = (id: string, value: Partial<Omit<PhotoStandardCategory, 'id' | 'createdAt'>>) => updateRecord<PhotoStandardCategory>(categoriesPath, id, value);
export const deletePhotoStandardCategory = (id: string) => deleteRecord(categoriesPath, id);
export const createPhotoStandardProduct = (value: Omit<PhotoStandardProduct, 'id' | 'createdAt' | 'updatedAt'>) => createRecord<PhotoStandardProduct>(productsPath, value);
export const updatePhotoStandardProduct = (id: string, value: Partial<Omit<PhotoStandardProduct, 'id' | 'createdAt'>>) => updateRecord<PhotoStandardProduct>(productsPath, id, value);

export async function deletePhotoStandardProduct(product: PhotoStandardProduct) {
  await Promise.all([...(product.imageUrls ?? []), product.pdfUrl, product.videoUrl].filter(Boolean).map(url => deleteManagedStorageUrl(url).catch(() => false)));
  await deleteRecord(productsPath, product.id);
}

const safeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');
export const uploadPhotoStandardImage = (productId: string, file: File) => uploadAtStoragePath(`photoStandards/${productId}/images/${Date.now()}-${safeName(file.name)}`, file);
export const uploadPhotoStandardPdf = (productId: string, file: File) => uploadAtStoragePath(`photoStandards/${productId}/manual.pdf`, file);
export const uploadPhotoStandardVideo = (productId: string, file: File) => uploadAtStoragePath(`photoStandards/${productId}/video.mp4`, file);
