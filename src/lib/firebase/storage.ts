// src/lib/firebase/storage.ts
import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    listAll,
    getMetadata,
} from 'firebase/storage';
import { storage } from './firebase-config';

// Типы для загрузки файлов
export interface UploadProgress {
    bytesTransferred: number;
    totalBytes: number;
    percentage: number;
}

export interface UploadResult {
    url: string;
    path: string;
    filename: string;
    size: number;
}

/**
 * Генерирует уникальное имя файла
 */
const generateUniqueFilename = (originalName: string): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
};

/**
 * Проверяет тип файла
 */
const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.some(type => file.type.startsWith(type));
};

/**
 * Проверяет размер файла (в байтах)
 */
const validateFileSize = (file: File, maxSize: number): boolean => {
    return file.size <= maxSize;
};

/**
 * ЗАГРУЗКА ФОТОГРАФИЙ ДЛЯ ОТЗЫВОВ
 */

export const uploadReviewPhoto = async (
    file: File,
    reviewId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    // Валидация файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validateFileType(file, allowedTypes)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    if (!validateFileSize(file, maxSize)) {
        throw new Error('File size too large. Maximum size is 5MB.');
    }

    try {
        const filename = generateUniqueFilename(file.name);
        const storagePath = `reviews/${reviewId}/${filename}`;
        const storageRef = ref(storage, storagePath);

        if (onProgress) {
            // Загрузка с отслеживанием прогресса
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress: UploadProgress = {
                            bytesTransferred: snapshot.bytesTransferred,
                            totalBytes: snapshot.totalBytes,
                            percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                        };
                        onProgress(progress);
                    },
                    (error) => {
                        console.error('Upload error:', error);
                        reject(new Error('Failed to upload image'));
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            const metadata = await getMetadata(uploadTask.snapshot.ref);

                            resolve({
                                url: downloadURL,
                                path: storagePath,
                                filename,
                                size: metadata.size,
                            });
                        } catch (error) {
                            reject(new Error('Failed to get download URL'));
                        }
                    }
                );
            });
        } else {
            // Простая загрузка без прогресса
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            const metadata = await getMetadata(snapshot.ref);

            return {
                url: downloadURL,
                path: storagePath,
                filename,
                size: metadata.size,
            };
        }
    } catch (error) {
        console.error('Error uploading review photo:', error);
        throw new Error('Failed to upload review photo');
    }
};

/**
 * Загрузка нескольких фотографий для отзыва
 */
export const uploadMultipleReviewPhotos = async (
    files: File[],
    reviewId: string,
    onIndividualProgress?: (index: number, progress: UploadProgress) => void,
    onOverallProgress?: (completed: number, total: number) => void
): Promise<UploadResult[]> => {
    const maxFiles = 5; // Максимум 5 фото на отзыв

    if (files.length > maxFiles) {
        throw new Error(`Too many files. Maximum ${maxFiles} photos per review.`);
    }

    const results: UploadResult[] = [];
    let completed = 0;

    try {
        const uploadPromises = files.map(async (file, index) => {
            const result = await uploadReviewPhoto(
                file,
                reviewId,
                onIndividualProgress ? (progress) => onIndividualProgress(index, progress) : undefined
            );

            completed++;
            if (onOverallProgress) {
                onOverallProgress(completed, files.length);
            }

            return result;
        });

        const uploadResults = await Promise.all(uploadPromises);
        results.push(...uploadResults);

        return results;
    } catch (error) {
        console.error('Error uploading multiple photos:', error);
        throw new Error('Failed to upload photos');
    }
};

/**
 * ЗАГРУЗКА АВАТАРОВ И ЛОГОТИПОВ
 */

export const uploadUserAvatar = async (
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB для аватаров

    if (!validateFileType(file, allowedTypes)) {
        throw new Error('Invalid file type for avatar.');
    }

    if (!validateFileSize(file, maxSize)) {
        throw new Error('Avatar file size too large. Maximum size is 2MB.');
    }

    try {
        const filename = generateUniqueFilename(file.name);
        const storagePath = `avatars/${userId}/${filename}`;
        const storageRef = ref(storage, storagePath);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const metadata = await getMetadata(snapshot.ref);

        return {
            url: downloadURL,
            path: storagePath,
            filename,
            size: metadata.size,
        };
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw new Error('Failed to upload avatar');
    }
};

export const uploadStoreLogo = async (
    file: File,
    storeId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const maxSize = 3 * 1024 * 1024; // 3MB для логотипов

    if (!validateFileType(file, allowedTypes)) {
        throw new Error('Invalid file type for logo.');
    }

    if (!validateFileSize(file, maxSize)) {
        throw new Error('Logo file size too large. Maximum size is 3MB.');
    }

    try {
        const filename = generateUniqueFilename(file.name);
        const storagePath = `logos/${storeId}/${filename}`;
        const storageRef = ref(storage, storagePath);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const metadata = await getMetadata(snapshot.ref);

        return {
            url: downloadURL,
            path: storagePath,
            filename,
            size: metadata.size,
        };
    } catch (error) {
        console.error('Error uploading logo:', error);
        throw new Error('Failed to upload logo');
    }
};

/**
 * ПОЛУЧЕНИЕ И УПРАВЛЕНИЕ ФАЙЛАМИ
 */

export const get