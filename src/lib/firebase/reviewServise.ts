import {
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
    addDoc,
    doc,
    getDoc,
    orderBy,
    limit,
    startAfter,
    getCountFromServer,
    DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config.ts';
import { PLANS, Plans } from './plans';

interface ReviewQueryOptions {
    limit?: number;
    sortBy?: 'newest' | 'rating' | 'oldest';
    filterRating?: number | null;
    startAfter?: DocumentSnapshot | null;
    statsOnly?: boolean;
    skipPagination?: boolean; // Если true, возвращает простой массив без метаданных
}

interface ReviewStats {
    totalCount: number;
    averageRating: number;
    ratingDistribution: Array<{
        rating: number;
        count: number;
        percentage: number;
    }>;
}

interface SubmitReviewParams {
    shopOwnerId: string;
    customerName: string;
    rating: number;
    text: string;
    media?: string[];
}

export const submitReview = async ({
                                       shopOwnerId,
                                       customerName,
                                       rating,
                                       text,
                                       media = []
                                   }: SubmitReviewParams) => {
    await addDoc(collection(db, 'reviews'), {
        shopOwnerId,
        name: customerName,
        rating,
        text,
        date: serverTimestamp(),
        ...(media.length > 0 && { media }),
    });
};

// Вспомогательная функция для получения статистики
async function getReviewsStats(shopOwnerId: string): Promise<ReviewStats> {
    const reviewsRef = collection(db, 'reviews');
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
}

// УНИВЕРСАЛЬНАЯ ФУНКЦИЯ
export const getReviewsForShop = async (
    shopOwnerId: string,
    options: ReviewQueryOptions = {}
) => {
    const {
        limit: limitCount = 10,
        sortBy = 'newest',
        filterRating = null,
        startAfter: startAfterDoc = null,
        statsOnly = false,
        skipPagination = false, // Для простого использования на Dashboard
    } = options;

    // Если нужна только статистика
    if (statsOnly) {
        return await getReviewsStats(shopOwnerId);
    }

    const reviewsRef = collection(db, 'reviews');

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
};

export const canSubmitReview = async (shopOwnerId: string) => {
    const shopRef = doc(db, 'users', shopOwnerId);
    const shopSnap = await getDoc(shopRef);
    const shopData = shopSnap.data();
    const plan = (shopData?.plan || 'free') as keyof Plans;
    const maxReviews = PLANS[plan].maxReviews;

    // Используем getCountFromServer для оптимизации
    const q = query(collection(db, 'reviews'), where('shopOwnerId', '==', shopOwnerId));
    const countSnapshot = await getCountFromServer(q);

    return countSnapshot.data().count < maxReviews;
};

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ ДЛЯ СТРАНИЦЫ ОТЗЫВОВ =====

/**
 * Получение публичной информации о магазине по ID
 * Используется на публичной странице отзывов
 */
export const getShopById = async (shopId: string) => {
    try {
        const shopDoc = await getDoc(doc(db, 'users', shopId));

        if (!shopDoc.exists()) {
            throw new Error('Магазин не найден');
        }

        const data = shopDoc.data();

        // Возвращаем только публичную информацию
        return {
            id: shopDoc.id,
            name: data.name || '',
            avatar: data.avatar || '',
            description: data.description || '',
            instagram: data.instagram || '',
        };
    } catch (error) {
        console.error('Ошибка получения данных магазина:', error);
        throw error;
    }
};

/**
 * Получение статистики отзывов для публичной страницы
 * Использует существующую функцию getReviewsStats
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
 */
export const getPublicReviews = async (
    shopId: string,
    options: ReviewQueryOptions = {}
) => {
    try {
        return await getReviewsForShop(shopId, options);
    } catch (error) {
        console.error('Ошибка получения публичных отзывов:', error);
        throw error;
    }
};