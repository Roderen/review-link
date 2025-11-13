import { getUserProfile } from '@/lib/firebase/services/users';
import { getReviewLinks } from '@/lib/firebase/services/review-links';
import { getReviewStats } from './review.stats';
import type { ReviewStatsResult } from './review.stats';

/**
 * Интерфейс для статистики подписки
 */
export interface SubscriptionStats {
    /** Текущий тарифный план */
    plan: string;
    /** Лимит отзывов по плану */
    reviewsLimit: number;
    /** Использовано отзывов */
    reviewsUsed: number;
    /** Осталось отзывов */
    reviewsRemaining: number;
    /** Процент использования */
    usagePercentage: number;
}

/**
 * Интерфейс для статистики ссылок
 */
export interface LinksStats {
    /** Общее количество ссылок */
    total: number;
    /** Активных ссылок */
    active: number;
    /** Общее количество использований всех ссылок */
    totalUsage: number;
}

/**
 * Интерфейс для всей статистики дашборда
 */
export interface DashboardStatsResult {
    /** Статистика подписки */
    subscription: SubscriptionStats;
    /** Статистика отзывов */
    reviews: ReviewStatsResult;
    /** Статистика ссылок */
    links: LinksStats;
}

/**
 * Получает полную статистику для дашборда магазина
 * Объединяет данные о подписке, отзывах и ссылках
 * @param storeOwnerId - ID владельца магазина
 * @returns Promise<DashboardStatsResult> - Полная статистика дашборда
 * @throws Error если не удалось получить статистику
 *
 * @example
 * const stats = await getDashboardStats('user123');
 * console.log(`План: ${stats.subscription.plan}`);
 * console.log(`Использовано: ${stats.subscription.reviewsUsed}/${stats.subscription.reviewsLimit}`);
 * console.log(`Средний рейтинг: ${stats.reviews.averageRating}`);
 */
export const getDashboardStats = async (storeOwnerId: string): Promise<DashboardStatsResult> => {
    try {
        const user = await getUserProfile(storeOwnerId);
        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const reviewStats = await getReviewStats(storeOwnerId);

        // Статистика по ссылкам
        const links = await getReviewLinks(storeOwnerId);
        const activeLinks = links.filter((link) => link.isActive).length;
        const totalLinkUsage = links.reduce((sum, link) => sum + link.usageCount, 0);

        return {
            // Информация о подписке
            subscription: {
                plan: user.subscription.plan,
                reviewsLimit: user.subscription.reviewsLimit,
                reviewsUsed: user.subscription.reviewsUsed,
                reviewsRemaining: user.subscription.reviewsLimit - user.subscription.reviewsUsed,
                usagePercentage: (user.subscription.reviewsUsed / user.subscription.reviewsLimit) * 100,
            },

            // Статистика отзывов
            reviews: reviewStats,

            // Статистика ссылок
            links: {
                total: links.length,
                active: activeLinks,
                totalUsage: totalLinkUsage,
            },
        };
    } catch (error) {
        console.error('Ошибка получения статистики дашборда:', error);
        throw new Error('Не удалось получить статистику дашборда');
    }
};
