/**
 * Интерфейс для тарифного плана
 */
export interface SubscriptionPlan {
    /** Уникальный ID плана */
    id: string;
    /** Название плана (системное) */
    name: 'FREE' | 'PRO' | 'BUSINESS';
    /** Отображаемое название */
    displayName: string;
    /** Цена в центах */
    price: number;
    /** Валюта */
    currency: 'USD';
    /** Лимит отзывов по плану */
    reviewsLimit: number;
    /** Список возможностей плана */
    features: string[];
    /** Популярный ли план (для отображения бейджа) */
    isPopular?: boolean;
}
