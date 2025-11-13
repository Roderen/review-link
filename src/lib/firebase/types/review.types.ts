import { DocumentSnapshot } from 'firebase/firestore';

/**
 * Опции для запроса отзывов
 */
export interface ReviewQueryOptions {
    /** Максимальное количество отзывов для загрузки */
    limit?: number;
    /** Способ сортировки отзывов */
    sortBy?: 'newest' | 'rating' | 'oldest';
    /** Фильтр по рейтингу (1-5 звезд) */
    filterRating?: number | null;
    /** Документ для пагинации (последний загруженный документ) */
    startAfter?: DocumentSnapshot | null;
    /** Если true, возвращает только статистику без отзывов */
    statsOnly?: boolean;
    /** Если true, возвращает простой массив без метаданных пагинации */
    skipPagination?: boolean;
}

/**
 * Статистика по отзывам
 */
export interface ReviewStats {
    /** Общее количество отзывов */
    totalCount: number;
    /** Средний рейтинг (0-5) */
    averageRating: number;
    /** Распределение отзывов по рейтингам */
    ratingDistribution: Array<{
        /** Рейтинг (1-5 звезд) */
        rating: number;
        /** Количество отзывов с этим рейтингом */
        count: number;
        /** Процент отзывов с этим рейтингом */
        percentage: number;
    }>;
}

/**
 * Параметры для отправки нового отзыва
 */
export interface SubmitReviewParams {
    /** ID владельца магазина */
    shopOwnerId: string;
    /** Имя клиента, оставившего отзыв */
    customerName: string;
    /** Рейтинг (1-5 звезд) */
    rating: number;
    /** Текст отзыва */
    text: string;
    /** Массив URL медиа-файлов (фото/видео) */
    media?: string[];
    /** Уникальный ID ссылки для отзыва (для одноразовых ссылок) */
    reviewLinkId?: string;
}

/**
 * Результат запроса отзывов с пагинацией
 */
export interface ReviewQueryResult {
    /** Массив отзывов */
    reviews: any[];
    /** Последний загруженный документ для пагинации */
    lastVisible: DocumentSnapshot | null;
    /** Есть ли еще отзывы для загрузки */
    hasMore: boolean;
    /** Общее количество отзывов с учетом фильтров */
    totalCount: number;
}
