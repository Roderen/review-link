import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    canSubmitReview,
    canUseReviewLink,
    submitReview,
    getPublicReviewsStats,
} from '@/lib/firebase/services/reviews';
import { ShopStats } from '@/types/review-form';

type LimitType = 'shop-limit' | 'link-used' | null;

interface UseReviewSubmissionProps {
    shopOwnerId: string | undefined;
    reviewLinkId: string | null;
    isAuthLoading: boolean;
}

/**
 * Custom hook для управления процессом отправки отзыва
 * Проверяет лимиты, валидирует ссылки и обрабатывает отправку
 */
export const useReviewSubmission = ({
    shopOwnerId,
    reviewLinkId,
    isAuthLoading,
}: UseReviewSubmissionProps) => {
    const [canSubmit, setCanSubmit] = useState<boolean | null>(null);
    const [limitType, setLimitType] = useState<LimitType>(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [shopStats, setShopStats] = useState<ShopStats | null>(null);

    // Проверка лимитов при загрузке
    useEffect(() => {
        const checkLimits = async () => {
            if (!shopOwnerId) return;

            setLoading(true);
            try {
                // Загружаем статистику магазина
                const stats = await getPublicReviewsStats(shopOwnerId);
                setShopStats({
                    totalCount: stats.totalCount,
                    averageRating: stats.averageRating,
                });

                // Проверяем общий лимит отзывов для магазина
                const shopCanAcceptReviews = await canSubmitReview(shopOwnerId);

                if (!shopCanAcceptReviews) {
                    setCanSubmit(false);
                    setLimitType('shop-limit');
                    return;
                }

                // Проверяем, не использовалась ли уже эта ссылка для отзыва
                if (reviewLinkId) {
                    const linkCanBeUsed = await canUseReviewLink(reviewLinkId);

                    if (!linkCanBeUsed) {
                        setCanSubmit(false);
                        setLimitType('link-used');
                        return;
                    }
                }

                // Все проверки пройдены - можно отправлять
                setCanSubmit(true);
                setLimitType(null);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setCanSubmit(false);
                setLimitType('shop-limit');
            } finally {
                setLoading(false);
            }
        };

        if (!isAuthLoading && shopOwnerId) {
            checkLimits();
        }
    }, [shopOwnerId, isAuthLoading, reviewLinkId]);

    /**
     * Отправляет отзыв
     * @param data - Данные отзыва
     */
    const handleSubmit = async (data: {
        customerName: string;
        rating: number;
        text: string;
        media?: string[];
    }) => {
        if (!shopOwnerId) {
            toast.error('Ошибка: идентификатор магазина не найден');
            return;
        }

        if (!data.rating || !data.customerName.trim() || !data.text.trim()) {
            toast.error('Пожалуйста, заполните все обязательные поля');
            return;
        }

        setIsSubmitting(true);

        try {
            await submitReview({
                shopOwnerId,
                customerName: data.customerName,
                rating: data.rating,
                text: data.text,
                reviewLinkId: reviewLinkId || undefined,
                ...(data.media && data.media.length > 0 && { media: data.media }),
            });

            setIsSubmitted(true);
            toast.success('Спасибо за ваш отзыв!');
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
            toast.error('Ошибка при отправке отзыва');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        canSubmit,
        limitType,
        loading,
        isSubmitting,
        isSubmitted,
        shopStats,
        handleSubmit,
    };
};
