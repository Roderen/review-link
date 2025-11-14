import {
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config/firebase-config';

/**
 * Название коллекции отзывов в Firestore
 */
const REVIEWS_COLLECTION = 'reviews';

/**
 * Тип для отзывов (используется в подписках)
 */
type ReviewData = any;

/**
 * Подписывается на изменения отзывов магазина в реальном времени
 * @param storeOwnerId - ID владельца магазина
 * @param callback - Функция обратного вызова, вызываемая при изменениях
 * @returns Функция для отписки от обновлений
 *
 * @example
 * const unsubscribe = subscribeToReviews('user123', (reviews) => {
 *   console.log(`Получено ${reviews.length} отзывов`);
 *   setReviews(reviews);
 * });
 *
 * // Позже, для отписки:
 * unsubscribe();
 */
export const subscribeToReviews = (
    storeOwnerId: string,
    callback: (reviews: ReviewData[]) => void
): (() => void) => {
    const q = query(
        collection(db, REVIEWS_COLLECTION),
        where('storeOwnerId', '==', storeOwnerId),
        orderBy('createdAt', 'desc'),
        limit(50)
    );

    return onSnapshot(q, (querySnapshot) => {
        const reviews: ReviewData[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            reviews.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            });
        });
        callback(reviews);
    });
};
