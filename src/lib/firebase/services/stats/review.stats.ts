import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config/firebase-config';

/**
 * Название коллекции отзывов в Firestore
 */
const REVIEWS_COLLECTION = 'reviews';

/**
 * Интерфейс для статистики отзывов
 */
export interface ReviewStatsResult {
    /** Общее количество отзывов */
    totalReviews: number;
    /** Количество публичных отзывов */
    publicReviews: number;
    /** Количество отзывов за последние 30 дней */
    recentReviews: number;
    /** Средний рейтинг (округленный до 1 знака) */
    averageRating: number;
    /** Распределение отзывов по рейтингам (1-5 звезд) */
    ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

/**
 * Получает статистику отзывов для магазина
 * @param storeOwnerId - ID владельца магазина
 * @returns Promise<ReviewStatsResult> - Статистика отзывов
 * @throws Error если не удалось получить статистику
 *
 * @example
 * const stats = await getReviewStats('user123');
 * console.log(`Средний рейтинг: ${stats.averageRating}`);
 * console.log(`5-звездочных: ${stats.ratingDistribution[5]}`);
 */
export const getReviewStats = async (storeOwnerId: string): Promise<ReviewStatsResult> => {
    try {
        const reviewsRef = collection(db, REVIEWS_COLLECTION);

        // Общее количество отзывов
        const totalQuery = query(reviewsRef, where('storeOwnerId', '==', storeOwnerId));
        const totalSnapshot = await getDocs(totalQuery);
        const totalReviews = totalSnapshot.size;

        // Публичные отзывы
        const publicQuery = query(
            reviewsRef,
            where('storeOwnerId', '==', storeOwnerId),
            where('isPublic', '==', true)
        );
        const publicSnapshot = await getDocs(publicQuery);
        const publicReviews = publicSnapshot.size;

        // Средний рейтинг и распределение по звездам
        let totalRating = 0;
        const ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };

        totalSnapshot.forEach((doc) => {
            const data = doc.data();
            const rating = data.rating || 0;
            totalRating += rating;
            if (rating >= 1 && rating <= 5) {
                ratingDistribution[rating as 1 | 2 | 3 | 4 | 5]++;
            }
        });

        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        // Отзывы за последние 30 дней
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentQuery = query(
            reviewsRef,
            where('storeOwnerId', '==', storeOwnerId),
            where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo))
        );
        const recentSnapshot = await getDocs(recentQuery);
        const recentReviews = recentSnapshot.size;

        return {
            totalReviews,
            publicReviews,
            recentReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution,
        };
    } catch (error) {
        console.error('Ошибка получения статистики отзывов:', error);
        throw new Error('Не удалось получить статистику отзывов');
    }
};
