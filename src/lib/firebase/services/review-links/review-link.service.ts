import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import type { ReviewLink, CreateReviewLinkOptions } from '@/lib/firebase/types/review-link.types';

/**
 * Название коллекции ссылок отзывов в Firestore
 */
const REVIEW_LINKS_COLLECTION = 'review_links';

/**
 * Создает новую ссылку для сбора отзывов
 * @param storeOwnerId - ID владельца магазина
 * @param options - Дополнительные опции (customMessage, maxUsage, expiresAt)
 * @returns Promise<ReviewLink> - Созданная ссылка
 * @throws Error если не удалось создать ссылку
 *
 * @example
 * const link = await createReviewLink('user123', {
 *   customMessage: 'Спасибо за покупку!',
 *   maxUsage: 100
 * });
 */
export const createReviewLink = async (
    storeOwnerId: string,
    options?: CreateReviewLinkOptions
): Promise<ReviewLink> => {
    try {
        const linkData = {
            storeOwnerId,
            isActive: true,
            usageCount: 0,
            maxUsage: options?.maxUsage || null,
            customMessage: options?.customMessage || null,
            expiresAt: options?.expiresAt ? Timestamp.fromDate(options.expiresAt) : null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, REVIEW_LINKS_COLLECTION), linkData);

        return {
            id: docRef.id,
            storeOwnerId,
            isActive: true,
            usageCount: 0,
            maxUsage: options?.maxUsage,
            customMessage: options?.customMessage,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: options?.expiresAt,
        };
    } catch (error) {
        console.error('Ошибка создания ссылки отзыва:', error);
        throw new Error('Не удалось создать ссылку отзыва');
    }
};

/**
 * Получает все ссылки владельца магазина
 * @param storeOwnerId - ID владельца магазина
 * @returns Promise<ReviewLink[]> - Массив ссылок, отсортированных по дате создания (новые первые)
 * @throws Error если не удалось получить ссылки
 *
 * @example
 * const links = await getReviewLinks('user123');
 * console.log(`Всего ссылок: ${links.length}`);
 */
export const getReviewLinks = async (storeOwnerId: string): Promise<ReviewLink[]> => {
    try {
        const q = query(
            collection(db, REVIEW_LINKS_COLLECTION),
            where('storeOwnerId', '==', storeOwnerId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const links: ReviewLink[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            links.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                expiresAt: data.expiresAt?.toDate(),
            } as ReviewLink);
        });

        return links;
    } catch (error) {
        console.error('Ошибка получения ссылок отзывов:', error);
        throw new Error('Не удалось получить ссылки отзывов');
    }
};

/**
 * Получает ссылку по ID с валидацией срока действия и лимита использований
 * @param linkId - ID ссылки
 * @returns Promise<ReviewLink | null> - Ссылка или null если не найдена/невалидна
 * @throws Error если произошла ошибка при получении
 *
 * @example
 * const link = await getReviewLink('link123');
 * if (link) {
 *   console.log('Ссылка активна');
 * } else {
 *   console.log('Ссылка истекла или недействительна');
 * }
 */
export const getReviewLink = async (linkId: string): Promise<ReviewLink | null> => {
    try {
        const linkDoc = await getDoc(doc(db, REVIEW_LINKS_COLLECTION, linkId));

        if (linkDoc.exists()) {
            const data = linkDoc.data();

            // Проверяем не истекла ли ссылка
            if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
                return null;
            }

            // Проверяем не превышен ли лимит использований
            if (data.maxUsage && data.usageCount >= data.maxUsage) {
                return null;
            }

            return {
                ...data,
                id: linkDoc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                expiresAt: data.expiresAt?.toDate(),
            } as ReviewLink;
        }

        return null;
    } catch (error) {
        console.error('Ошибка получения ссылки отзыва:', error);
        throw new Error('Не удалось получить ссылку отзыва');
    }
};

/**
 * Обновляет данные ссылки отзыва
 * @param linkId - ID ссылки
 * @param updates - Частичные данные для обновления
 * @returns Promise<void>
 * @throws Error если не удалось обновить ссылку
 *
 * @example
 * await updateReviewLink('link123', {
 *   maxUsage: 200,
 *   customMessage: 'Новое сообщение'
 * });
 */
export const updateReviewLink = async (
    linkId: string,
    updates: Partial<ReviewLink>
): Promise<void> => {
    try {
        const linkDoc = doc(db, REVIEW_LINKS_COLLECTION, linkId);
        const updateData = { ...updates };

        // Конвертируем Date в Timestamp если есть expiresAt
        if (updateData.expiresAt) {
            updateData.expiresAt = Timestamp.fromDate(updateData.expiresAt) as any;
        }

        await updateDoc(linkDoc, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Ошибка обновления ссылки отзыва:', error);
        throw new Error('Не удалось обновить ссылку отзыва');
    }
};

/**
 * Деактивирует ссылку отзыва
 * @param linkId - ID ссылки
 * @returns Promise<void>
 * @throws Error если не удалось деактивировать ссылку
 *
 * @example
 * await deactivateReviewLink('link123');
 */
export const deactivateReviewLink = async (linkId: string): Promise<void> => {
    try {
        await updateReviewLink(linkId, { isActive: false });
    } catch (error) {
        console.error('Ошибка деактивации ссылки отзыва:', error);
        throw new Error('Не удалось деактивировать ссылку отзыва');
    }
};
