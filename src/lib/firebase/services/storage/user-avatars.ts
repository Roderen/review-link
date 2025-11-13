import { ref, uploadBytes, getDownloadURL, getMetadata } from 'firebase/storage';
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
 * Загружает аватар пользователя в Firebase Storage
 * @param file - Файл изображения для аватара
 * @param userId - ID пользователя
 * @param _onProgress - Callback для отслеживания прогресса (зарезервировано для будущего использования)
 * @returns Promise<UploadResult> - Результат загрузки с URL и метаданными
 * @throws Error если файл невалиден или загрузка не удалась
 *
 * @example
 * const result = await uploadUserAvatar(file, 'user123');
 * await updateUserProfile('user123', { avatar: result.url });
 */
export const uploadUserAvatar = async (
    file: File,
    userId: string,
    _onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB для аватаров

    if (!validateFileType(file, allowedTypes)) {
        throw new Error('Неверный тип файла для аватара. Разрешены только JPEG, PNG и WebP.');
    }

    if (!validateFileSize(file, maxSize)) {
        throw new Error('Размер файла аватара слишком большой. Максимальный размер 2MB.');
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
        console.error('Ошибка загрузки аватара:', error);
        throw new Error('Не удалось загрузить аватар');
    }
};
