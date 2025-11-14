import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    startAfter,
    getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config/firebase-config';
import type {
    ReviewQueryOptions,
    ReviewStats,
    ReviewQueryResult,
} from '@/lib/firebase/types/review.types';

/**
 * Название коллекции отзывов в Firestore
 */
const REVIEWS_COLLECTION = 'reviews';

/**
 * Тип для отзывов (используется внутри функций)
 */
type ReviewData = any;

/**
 * Получает статистику по отзывам для магазина
 * @param shopOwnerId - ID владельца магазина
 * @returns Promise<ReviewStats> - Статистика отзывов (общее количество, средний рейтинг, распределение)
 * @throws Error если не удалось получить статистику
 *
 * @example
 * const stats = await getReviewsStats('user123');
 * console.log(`Средний рейтинг: ${stats.averageRating}`);
 */
export const getReviewsStats = async (shopOwnerId: string): Promise<ReviewStats> => {
    try {
        const reviewsRef = collection(db, REVIEWS_COLLECTION);
        const baseQuery = query(reviewsRef, where('shopOwnerId', '==', shopOwnerId));

        // Получаем все отзывы для статистики (только один раз при загрузке)
        const snapshot = await getDocs(baseQuery);
        const reviews = snapshot.docs.map(doc => doc.data());

        const totalCount = reviews.length;
        const averageRating =
            totalCount > 0
                ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalCount
                : 0;

        // Подсчет распределения по рейтингам
        const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
            const count = reviews.filter(review => review.rating === rating).length;
            return {
                rating,
                count,
                percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
            };
        });

        return {
            totalCount,
            averageRating,
            ratingDistribution,
        };
    } catch (error) {
        console.error('Ошибка получения статистики отзывов:', error);
        throw new Error('Не удалось получить статистику отзывов');
    }
};

/**
 * Универсальная функция для получения отзывов магазина с фильтрацией, сортировкой и пагинацией
 * @param shopOwnerId - ID владельца магазина
 * @param options - Опции запроса (limit, sortBy, filterRating, startAfter, statsOnly, skipPagination)
 * @returns Promise<ReviewQueryResult | any[] | ReviewStats> - Отзывы с метаданными, простой массив или статистика
 * @throws Error если не удалось получить отзывы
 *
 * @example
 * // Получить первую страницу отзывов
 * const result = await getReviewsForShop('user123', { limit: 10, sortBy: 'newest' });
 *
 * // Получить только статистику
 * const stats = await getReviewsForShop('user123', { statsOnly: true });
 *
 * // Получить простой массив (для Dashboard)
 * const reviews = await getReviewsForShop('user123', { skipPagination: true, limit: 5 });
 */
export const getReviewsForShop = async (
    shopOwnerId: string,
    options: ReviewQueryOptions = {}
): Promise<ReviewQueryResult | any[] | ReviewStats> => {
    const {
        limit: limitCount = 10,
        sortBy = 'newest',
        filterRating = null,
        startAfter: startAfterDoc = null,
        statsOnly = false,
        skipPagination = false,
    } = options;

    // Если нужна только статистика
    if (statsOnly) {
        return await getReviewsStats(shopOwnerId);
    }

    try {
        const reviewsRef = collection(db, REVIEWS_COLLECTION);

        // Определяем поле и направление сортировки
        let orderByField: string;
        let orderDirection: 'asc' | 'desc';

        switch (sortBy) {
            case 'rating':
                orderByField = 'rating';
                orderDirection = 'desc';
                break;
            case 'oldest':
                orderByField = 'date';
                orderDirection = 'asc';
                break;
            case 'newest':
            default:
                orderByField = 'date';
                orderDirection = 'desc';
                break;
        }

        // Строим запрос
        let reviewQuery = query(
            reviewsRef,
            where('shopOwnerId', '==', shopOwnerId)
        );

        // Добавляем фильтр по рейтингу если указан
        if (filterRating !== null) {
            reviewQuery = query(reviewQuery, where('rating', '==', filterRating));
        }

        // Добавляем сортировку
        reviewQuery = query(reviewQuery, orderBy(orderByField, orderDirection));

        // Добавляем пагинацию
        if (startAfterDoc) {
            reviewQuery = query(reviewQuery, startAfter(startAfterDoc));
        }

        // Добавляем лимит
        reviewQuery = query(reviewQuery, limit(limitCount));

        // Получаем отзывы
        const snapshot = await getDocs(reviewQuery);
        const reviews = snapshot.docs.map(doc => {
            const data = doc.data();
            // Преобразуем timestamp в читаемый формат
            const date = data.date ? new Date(data.date.seconds * 1000) : new Date();

            return {
                id: doc.id,
                ...data,
                date: date,
            };
        });

        // Если skipPagination = true, возвращаем только массив (для Dashboard)
        if (skipPagination) {
            return reviews;
        }

        // Иначе возвращаем полный объект с метаданными (для Reviews Page)
        // Получаем общее количество отзывов с учетом фильтров
        let countQuery = query(reviewsRef, where('shopOwnerId', '==', shopOwnerId));

        if (filterRating !== null) {
            countQuery = query(countQuery, where('rating', '==', filterRating));
        }

        const countSnapshot = await getCountFromServer(countQuery);
        const totalCount = countSnapshot.data().count;

        // Определяем, есть ли еще данные
        const hasMore = snapshot.docs.length === limitCount;
        const lastVisible =
            snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

        return {
            reviews,
            lastVisible,
            hasMore,
            totalCount,
        };
    } catch (error) {
        console.error('Ошибка получения отзывов для магазина:', error);
        throw new Error('Не удалось получить отзывы');
    }
};

/**
 * Получение статистики отзывов для публичной страницы
 * Алиас для getReviewsStats
 * @param shopId - ID магазина
 * @returns Promise<ReviewStats> - Статистика отзывов
 * @throws Error если не удалось получить статистику
 */
export const getPublicReviewsStats = async (shopId: string): Promise<ReviewStats> => {
    try {
        return await getReviewsStats(shopId);
    } catch (error) {
        console.error('Ошибка получения публичной статистики:', error);
        throw error;
    }
};

/**
 * Получение отзывов для публичной страницы
 * Алиас для getReviewsForShop - использует ту же универсальную функцию
 * @param shopId - ID магазина
 * @param options - Опции запроса
 * @returns Promise<ReviewQueryResult | any[] | ReviewStats> - Отзывы с метаданными или простой массив
 * @throws Error если не удалось получить отзывы
 */
export const getPublicReviews = async (
    shopId: string,
    options: ReviewQueryOptions = {}
): Promise<ReviewQueryResult | any[] | ReviewStats> => {
    try {
        return await getReviewsForShop(shopId, options);
    } catch (error) {
        console.error('Ошибка получения публичных отзывов:', error);
        throw error;
    }
};

/**
 * Получает количество отзывов для магазина
 * @param shopId - ID магазина
 * @returns Promise<number> - Количество отзывов
 * @throws Error если не удалось получить количество
 *
 * @example
 * const count = await getReviewsCount('user123');
 * console.log(`Всего отзывов: ${count}`);
 */
export const getReviewsCount = async (shopId: string): Promise<number> => {
    try {
        const reviewsCollection = collection(db, REVIEWS_COLLECTION);
        const q = query(reviewsCollection, where('shopOwnerId', '==', shopId));
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (error) {
        console.error('Ошибка при получении количества отзывов:', error);
        throw error;
    }
};

/**
 * Получает отзывы владельца магазина (для административной панели)
 * @param storeOwnerId - ID владельца магазина
 * @param limitCount - Максимальное количество отзывов (по умолчанию 50)
 * @returns Promise<ReviewData[]> - Массив отзывов, отсортированных по дате создания (новые первые)
 * @throws Error если не удалось получить отзывы
 *
 * @example
 * const reviews = await getReviewsByStoreOwner("user123", 20);
 * console.log(`Загружено ${reviews.length} отзывов`);
 */
export const getReviewsByStoreOwner = async (
    storeOwnerId: string,
    limitCount: number = 50
): Promise<ReviewData[]> => {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where("storeOwnerId", "==", storeOwnerId),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
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

        return reviews;
    } catch (error) {
        console.error("Ошибка получения отзывов владельца магазина:", error);
        throw new Error("Не удалось получить отзывы");
    }
};

