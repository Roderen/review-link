import { ref, uploadBytes, getDownloadURL, getMetadata } from 'firebase/storage';
import { storage } from '@/lib/firebase/config/firebase-config';
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
 * Загружает логотип магазина в Firebase Storage
 * @param file - Файл изображения для логотипа
 * @param storeId - ID магазина
 * @param _onProgress - Callback для отслеживания прогресса (зарезервировано для будущего использования)
 * @returns Promise<UploadResult> - Результат загрузки с URL и метаданными
 * @throws Error если файл невалиден или загрузка не удалась
 *
 * @example
 * const result = await uploadStoreLogo(file, 'store123');
 * await updateStoreProfile('store123', { logo: result.url });
 */
export const uploadStoreLogo = async (
    file: File,
    storeId: string,
    _onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const maxSize = 3 * 1024 * 1024; // 3MB для логотипов

    if (!validateFileType(file, allowedTypes)) {
        throw new Error('Неверный тип файла для логотипа. Разрешены JPEG, PNG, WebP и SVG.');
    }

    if (!validateFileSize(file, maxSize)) {
        throw new Error('Размер файла логотипа слишком большой. Максимальный размер 3MB.');
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
        console.error('Ошибка загрузки логотипа:', error);
        throw new Error('Не удалось загрузить логотип');
    }
};
