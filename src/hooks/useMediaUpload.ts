import { useState } from 'react';
import { toast } from 'sonner';

const UPLOADCARE_PUB_KEY = 'acb1f0d9f083d1dac8d6';
const UPLOADCARE_CDN_URL = 'https://2jzkd06n6i.ucarecd.net/';
const MAX_MEDIA_COUNT = 5;

/**
 * Custom hook для загрузки медиа-файлов через Uploadcare
 * @returns Состояние и методы для работы с медиа
 */
export const useMediaUpload = () => {
    const [media, setMedia] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

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

        setIsUploading(true);

        try {
            const filesToUpload = Array.from(files).slice(0, availableSlots);

            const uploadPromises = filesToUpload.map(async (file) => {
                const formData = new FormData();
                formData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUB_KEY);
                formData.append('file', file);

                const response = await fetch('https://upload.uploadcare.com/base/', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                return `${UPLOADCARE_CDN_URL}${data.file}/`;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setMedia((prev) => [...prev, ...uploadedUrls]);
            toast.success('Файлы загружены!');
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            toast.error('Ошибка при загрузке файлов');
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
