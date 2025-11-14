import { useEffect, useState } from 'react';
import { getPublicReviewsStats, getReviewsCount } from '@/lib/firebase/services/reviews';
import { ReviewStats } from '@/types/reviews-page';

/**
 * Custom hook для загрузки статистики отзывов
 * @param shopId - ID магазина
 * @returns Статистика отзывов и общее количество
 */
export const useReviewsStats = (shopId: string | undefined) => {
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!shopId) {
            setLoading(false);
            return;
        }

        const loadStats = async () => {
            try {
                setLoading(true);

                // Загружаем статистику и счетчик параллельно
                const [statsData, count] = await Promise.all([
                    getPublicReviewsStats(shopId),
                    getReviewsCount(shopId),
                ]);

                setStats(statsData);
                setReviewsCount(count);
            } catch (error) {
                console.error('Ошибка загрузки статистики:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [shopId]);

    return { stats, reviewsCount, loading };
};
