import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    getMetadata,
} from 'firebase/storage';
import { storage } from '@/lib/firebase/firebase-config';
import type { UploadProgress, UploadResult } from '@/lib/firebase/types/storage.types';

/**
 * Генерирует уникальное имя файла с timestamp и случайной строкой
 */
const generateUniqueFilename = (originalName: string): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
};

/**
 * Проверяет тип файла по MIME-типу
 */
const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.some((type) => file.type.startsWith(type));
};

/**
 * Проверяет размер файла (в байтах)
 */
const validateFileSize = (file: File, maxSize: number): boolean => {
    return file.size <= maxSize;
};

/**
 * Загружает одну фотографию для отзыва в Firebase Storage
 * @param file - Файл изображения для загрузки
 * @param reviewId - ID отзыва, к которому привязывается фото
 * @param onProgress - Callback для отслеживания прогресса загрузки (опционально)
 * @returns Promise<UploadResult> - Результат загрузки с URL и метаданными
 * @throws Error если файл невалиден или загрузка не удалась
 *
 * @example
 * const result = await uploadReviewPhoto(file, 'review123', (progress) => {
 *   console.log(`Загружено: ${progress.percentage}%`);
 * });
 * console.log(`URL фото: ${result.url}`);
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
        throw new Error('Неверный тип файла. Разрешены только JPEG, PNG и WebP изображения.');
    }

    if (!validateFileSize(file, maxSize)) {
        throw new Error('Размер файла слишком большой. Максимальный размер 5MB.');
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
                        console.error('Ошибка загрузки:', error);
                        reject(new Error('Не удалось загрузить изображение'));
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
                            reject(new Error('Не удалось получить URL загрузки'));
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
        console.error('Ошибка загрузки фото отзыва:', error);
        throw new Error('Не удалось загрузить фото отзыва');
    }
};

/**
 * Загружает несколько фотографий для отзыва одновременно
 * @param files - Массив файлов изображений
 * @param reviewId - ID отзыва, к которому привязываются фото
 * @param onIndividualProgress - Callback для отслеживания прогресса каждого файла (опционально)
 * @param onOverallProgress - Callback для отслеживания общего прогресса (опционально)
 * @returns Promise<UploadResult[]> - Массив результатов загрузки
 * @throws Error если превышен лимит файлов или загрузка не удалась
 *
 * @example
 * const results = await uploadMultipleReviewPhotos(
 *   files,
 *   'review123',
 *   (index, progress) => console.log(`Файл ${index}: ${progress.percentage}%`),
 *   (completed, total) => console.log(`Загружено ${completed} из ${total}`)
 * );
 */
export const uploadMultipleReviewPhotos = async (
    files: File[],
    reviewId: string,
    onIndividualProgress?: (index: number, progress: UploadProgress) => void,
    onOverallProgress?: (completed: number, total: number) => void
): Promise<UploadResult[]> => {
    const maxFiles = 5; // Максимум 5 фото на отзыв

    if (files.length > maxFiles) {
        throw new Error(`Слишком много файлов. Максимум ${maxFiles} фото на отзыв.`);
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
        console.error('Ошибка загрузки нескольких фото:', error);
        throw new Error('Не удалось загрузить фото');
    }
};
