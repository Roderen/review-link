import {
    collection,
    serverTimestamp,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import type { SubmitReviewParams, Review } from '@/lib/firebase/types/review.types';
import { getUserProfile } from '@/lib/firebase/services/users';
import { getReviewLink } from '@/lib/firebase/services/review-links';

/**
 * Название коллекций в Firestore
 */
const REVIEWS_COLLECTION = 'reviews';
const USERS_COLLECTION = 'users';
const REVIEW_LINKS_COLLECTION = 'review_links';

/**
 * Создает и сохраняет новый отзыв в Firestore
 * @param params - Параметры отзыва (shopOwnerId, customerName, rating, text, media, reviewLinkId)
 * @returns Promise<void>
 * @throws Error если не удалось сохранить отзыв
 *
 * @example
 * await submitReview({
 *   shopOwnerId: 'user123',
 *   customerName: 'Иван Иванов',
 *   rating: 5,
 *   text: 'Отличный магазин!',
 *   media: ['https://example.com/photo.jpg'],
 *   reviewLinkId: 'link123'
 * });
 */
export const submitReview = async ({
    shopOwnerId,
    customerName,
    rating,
    text,
    media = [],
    reviewLinkId
}: SubmitReviewParams): Promise<void> => {
    try {
        await addDoc(collection(db, REVIEWS_COLLECTION), {
            shopOwnerId,
            name: customerName,
            rating,
            text,
            date: serverTimestamp(),
            ...(reviewLinkId && { reviewLinkId }), // Сохраняем ID ссылки если есть
            ...(media.length > 0 && { media }),
        });
    } catch (error) {
        console.error('Ошибка при отправке отзыва:', error);
        throw new Error('Не удалось отправить отзыв');
    }
};

/**
 * Создает отзыв с полной бизнес-логикой (проверка лимитов, токенов, etc.)
 * @param reviewData - Данные отзыва без ID и timestamps
 * @param reviewToken - Опциональный токен ссылки для отзыва
 * @returns Promise<Review> - Созданный отзыв
 * @throws Error если превышен лимит или токен невалиден
 *
 * @example
 * const review = await createReview({
 *   storeOwnerId: 'user123',
 *   customerName: 'Иван',
 *   rating: 5,
 *   content: 'Отлично!'
 * }, 'token123');
 */
export const createReview = async (
    reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>,
    reviewToken?: string
): Promise<Review> => {
    try {
        // Проверяем лимит отзывов пользователя
        const user = await getUserProfile(reviewData.storeOwnerId);
        if (!user) {
            throw new Error('Владелец магазина не найден');
        }

        if (user.subscription.reviewsUsed >= user.subscription.reviewsLimit) {
            throw new Error('Превышен лимит отзывов для текущего тарифного плана');
        }

        // Проверяем валидность ссылки если передан токен
        if (reviewToken) {
            const linkDoc = await getDoc(doc(db, REVIEW_LINKS_COLLECTION, reviewToken));
            if (!linkDoc.exists() || !linkDoc.data()?.isActive) {
                throw new Error('Невалидная или истекшая ссылка отзыва');
            }

            // Увеличиваем счетчик использования ссылки
            await updateDoc(doc(db, REVIEW_LINKS_COLLECTION, reviewToken), {
                usageCount: increment(1),
                updatedAt: serverTimestamp(),
            });
        }

        // Создаем отзыв (БЕЗ модерации - сразу публичный)
        const reviewWithTimestamps = {
            ...reviewData,
            isPublic: true,
            metadata: {
                ...reviewData.metadata,
                reviewToken: reviewToken || null,
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewWithTimestamps);

        // Увеличиваем счетчик использованных отзывов
        await updateDoc(doc(db, USERS_COLLECTION, reviewData.storeOwnerId), {
            'subscription.reviewsUsed': increment(1),
            updatedAt: serverTimestamp(),
        });

        return {
            ...reviewData,
            id: docRef.id,
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error('Ошибка создания отзыва:', error);
        throw error;
    }
};

/**
 * Создает публичный отзыв через ссылку отзыва
 * @param reviewToken - Токен ссылки отзыва
 * @param reviewData - Данные отзыва от клиента
 * @returns Promise<Review> - Созданный отзыв
 * @throws Error если ссылка невалидна
 *
 * @example
 * const review = await createPublicReview('token123', {
 *   customerName: 'Мария',
 *   rating: 5,
 *   content: 'Прекрасно!'
 * });
 */
export const createPublicReview = async (
    reviewToken: string,
    reviewData: {
        customerName: string;
        customerEmail?: string;
        rating: number;
        title?: string;
        content: string;
        photos?: string[];
        metadata?: {
            ipAddress?: string;
            userAgent?: string;
        };
    }
): Promise<Review> => {
    try {
        // Получаем информацию о ссылке
        const reviewLink = await getReviewLink(reviewToken);
        if (!reviewLink || !reviewLink.isActive) {
            throw new Error('Невалидная или истекшая ссылка отзыва');
        }

        // Создаем отзыв
        const fullReviewData = {
            storeOwnerId: reviewLink.storeOwnerId,
            customerName: reviewData.customerName,
            customerEmail: reviewData.customerEmail,
            rating: reviewData.rating,
            title: reviewData.title || '',
            content: reviewData.content,
            photos: reviewData.photos || [],
            isPublic: true,
            metadata: {
                ...reviewData.metadata,
                source: 'DIRECT_LINK' as const,
                reviewToken,
            },
        };

        return await createReview(fullReviewData, reviewToken);
    } catch (error) {
        console.error('Ошибка создания публичного отзыва:', error);
        throw error;
    }
};

/**
 * Обновляет данные отзыва
 * @param reviewId - ID отзыва
 * @param updates - Частичные данные для обновления
 * @returns Promise<void>
 * @throws Error если не удалось обновить отзыв
 *
 * @example
 * await updateReview('review123', {
 *   rating: 4,
 *   isPublic: false
 * });
 */
export const updateReview = async (reviewId: string, updates: Partial<Review>): Promise<void> => {
    try {
        const reviewDoc = doc(db, REVIEWS_COLLECTION, reviewId);
        await updateDoc(reviewDoc, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Ошибка обновления отзыва:', error);
        throw new Error('Не удалось обновить отзыв');
    }
};

/**
 * Удаляет отзыв и обновляет счетчик использования
 * @param reviewId - ID отзыва
 * @param storeOwnerId - ID владельца магазина
 * @returns Promise<void>
 * @throws Error если не удалось удалить отзыв
 *
 * @example
 * await deleteReview('review123', 'user123');
 */
export const deleteReview = async (reviewId: string, storeOwnerId: string): Promise<void> => {
    try {
        // Удаляем отзыв
        await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));

        // Уменьшаем счетчик использованных отзывов
        await updateDoc(doc(db, USERS_COLLECTION, storeOwnerId), {
            'subscription.reviewsUsed': increment(-1),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Ошибка удаления отзыва:', error);
        throw new Error('Не удалось удалить отзыв');
    }
};
