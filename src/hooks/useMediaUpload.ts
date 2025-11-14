import { useState } from 'react';
import { toast } from 'sonner';

const UPLOADCARE_PUB_KEY = 'acb1f0d9f083d1dac8d6';
const UPLOADCARE_CDN_URL = 'https://2jzkd06n6i.ucarecd.net/';
const MAX_MEDIA_COUNT = 5;
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

/**
 * Custom hook для загрузки медиа-файлов через Uploadcare
 * @returns Состояние и методы для работы с медиа
 */
export const useMediaUpload = () => {
    const [media, setMedia] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    /**
     * Валидирует файл перед загрузкой
     */
    const validateFile = (file: File): string | null => {
        // Проверка размера
        if (file.size > MAX_FILE_SIZE) {
            return `Файл "${file.name}" слишком большой. Максимум 30 МБ`;
        }

        // Проверка типа
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

        if (!isImage && !isVideo) {
            return `Файл "${file.name}" имеет неподдерживаемый формат. Разрешены: JPG, PNG, GIF, WebP, MP4, WebM`;
        }

        return null;
    };

    /**
     * Загружает файлы на Uploadcare
     * @param files - FileList с файлами для загрузки
     */
    const uploadMedia = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const availableSlots = MAX_MEDIA_COUNT - media.length;
        if (availableSlots <= 0) {
            toast.error(`Максимум ${MAX_MEDIA_COUNT} файлов`);
            return;
        }

        // Валидация всех файлов
        const filesToUpload = Array.from(files).slice(0, availableSlots);
        for (const file of filesToUpload) {
            const validationError = validateFile(file);
            if (validationError) {
                toast.error(validationError);
                return;
            }
        }

        setIsUploading(true);

        try {
            const uploadPromises = filesToUpload.map(async (file) => {
                const formData = new FormData();
                formData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUB_KEY);
                formData.append('UPLOADCARE_STORE', '1');
                formData.append('file', file);

                const response = await fetch('https://upload.uploadcare.com/base/', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Upload error response:', errorText);
                    let errorData;
                    try {
                        errorData = JSON.parse(errorText);
                    } catch {
                        errorData = { error: errorText };
                    }

                    const errorMsg = errorData.error?.content || errorData.error || response.statusText;

                    // Специальная обработка для ошибки типа файла
                    if (errorMsg.includes('file types is not allowed')) {
                        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
                        if (isVideo) {
                            throw new Error(`Загрузка видео временно недоступна. Пожалуйста, используйте только фото (JPG, PNG, GIF, WebP)`);
                        }
                    }

                    throw new Error(`Ошибка загрузки "${file.name}": ${errorMsg}`);
                }

                const data = await response.json();
                return `${UPLOADCARE_CDN_URL}${data.file}/`;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setMedia((prev) => [...prev, ...uploadedUrls]);
            toast.success(`${uploadedUrls.length === 1 ? 'Файл загружен' : 'Файлы загружены'}!`);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            const errorMessage = error instanceof Error ? error.message : 'Ошибка при загрузке файлов';
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Удаляет медиа по индексу
     * @param index - Индекс медиа для удаления
     */
    const removeMedia = (index: number) => {
        setMedia((prev) => prev.filter((_, i) => i !== index));
    };

    /**
     * Сбрасывает все загруженные медиа
     */
    const resetMedia = () => {
        setMedia([]);
    };

    return {
        media,
        isUploading,
        uploadMedia,
        removeMedia,
        resetMedia,
        hasMedia: media.length > 0,
        canUploadMore: media.length < MAX_MEDIA_COUNT,
    };
};
