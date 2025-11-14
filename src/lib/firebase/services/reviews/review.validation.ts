import {
    collection,
    query,
    where,
    getCountFromServer,
    doc,
    getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config/firebase-config';
import { PLANS, type Plans } from '@/lib/firebase/config/subscription-plans';

/**
 * Название коллекций в Firestore
 */
const REVIEWS_COLLECTION = 'reviews';
const USERS_COLLECTION = 'users';

/**
 * Проверяет, может ли магазин принимать новые отзывы
 * Проверяет лимит отзывов согласно текущему тарифному плану
 * @param shopOwnerId - ID владельца магазина
 * @returns Promise<boolean> - true если можно отправить отзыв, false если лимит исчерпан
 * @throws Error если не удалось проверить возможность отправки
 *
 * @example
 * const canSubmit = await canSubmitReview('user123');
 * if (!canSubmit) {
 *   alert('Достигнут лимит отзывов по текущему тарифу');
 * }
 */
export const canSubmitReview = async (shopOwnerId: string): Promise<boolean> => {
    try {
        const shopRef = doc(db, USERS_COLLECTION, shopOwnerId);
        const shopSnap = await getDoc(shopRef);
        const shopData = shopSnap.data();
        const plan = (shopData?.plan || 'free') as keyof Plans;
        const maxReviews = PLANS[plan].maxReviews;

        // Используем getCountFromServer для оптимизации
        const q = query(collection(db, REVIEWS_COLLECTION), where('shopOwnerId', '==', shopOwnerId));
        const countSnapshot = await getCountFromServer(q);

        return countSnapshot.data().count < maxReviews;
    } catch (error) {
        console.error('Ошибка проверки возможности отправки отзыва:', error);
        throw new Error('Не удалось проверить возможность отправки отзыва');
    }
};

/**
 * Проверяет, была ли уже использована ссылка для отзыва
 * Предотвращает повторное использование одной и той же одноразовой ссылки
 * @param reviewLinkId - Уникальный ID ссылки для отзыва
 * @returns Promise<boolean> - true если ссылка еще не использовалась, false если уже использовалась
 *
 * @example
 * const canUse = await canUseReviewLink('link123');
 * if (!canUse) {
 *   alert('Эта ссылка уже была использована');
 * }
 */
export const canUseReviewLink = async (reviewLinkId: string): Promise<boolean> => {
    try {
        // Если reviewLinkId не передан, разрешаем (обратная совместимость)
        if (!reviewLinkId) {
            return true;
        }

        // Проверяем, есть ли уже отзыв с этим reviewLinkId
        const reviewsRef = collection(db, REVIEWS_COLLECTION);
        const q = query(
            reviewsRef,
            where('reviewLinkId', '==', reviewLinkId)
        );

        const countSnapshot = await getCountFromServer(q);
        const reviewCount = countSnapshot.data().count;

        // Если отзывов с этой ссылкой нет, можно отправлять
        return reviewCount === 0;
    } catch (error) {
        console.error('Ошибка проверки ссылки для отзыва:', error);
        // В случае ошибки разрешаем отправку (fail-open)
        return true;
    }
};
