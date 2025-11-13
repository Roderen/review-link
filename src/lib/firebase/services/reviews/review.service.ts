import {
    collection,
    serverTimestamp,
    addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import type { SubmitReviewParams } from '@/lib/firebase/types/review.types';

/**
 * Название коллекции отзывов в Firestore
 */
const REVIEWS_COLLECTION = 'reviews';

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
