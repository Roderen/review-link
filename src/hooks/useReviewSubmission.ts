import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    canSubmitReview,
    canUseReviewLink,
    submitReview,
    getPublicReviewsStats,
} from '@/lib/firebase/services/reviews';
import { getReviewLink } from '@/lib/firebase/services/review-links';
import { ShopStats } from '@/types/review-form';
import type { PlanType } from '@/lib/firebase/config/subscription-plans';

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
    const [ownerPlan, setOwnerPlan] = useState<PlanType>('FREE');
    const [isOwnerPlanLoaded, setIsOwnerPlanLoaded] = useState(false);

    // Проверка лимитов при загрузке
    useEffect(() => {
        const checkLimits = async () => {
            // Сначала получаем shopOwnerId из reviewLink если он не передан напрямую
            let actualShopOwnerId = shopOwnerId;

            if (!actualShopOwnerId && reviewLinkId) {
                try {
                    const linkData = await getReviewLink(reviewLinkId);
                    if (linkData) {
                        actualShopOwnerId = linkData.storeOwnerId;
                    }
                } catch (error) {
                    console.error('Ошибка загрузки review link:', error);
                }
            }

            if (!actualShopOwnerId) return;

            setLoading(true);
            try {
                // Загружаем данные владельца магазина для получения его плана
                const ownerDoc = await getDoc(doc(db, 'users', actualShopOwnerId));
                if (ownerDoc.exists()) {
                    const ownerData = ownerDoc.data();
                    const plan = (ownerData?.plan || 'FREE') as PlanType;
                    console.log('🎯 Owner plan loaded:', plan);
                    setOwnerPlan(plan);
                } else {
                    console.warn('⚠️ Owner document not found, using FREE plan');
                    setOwnerPlan('FREE');
                }

                // Загружаем статистику магазина
                const stats = await getPublicReviewsStats(actualShopOwnerId);
                setShopStats({
                    totalCount: stats.totalCount,
                    averageRating: stats.averageRating,
                });

                // Проверяем общий лимит отзывов для магазина
                const shopCanAcceptReviews = await canSubmitReview(actualShopOwnerId);

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
                console.error('❌ Ошибка загрузки данных:', error);
                setCanSubmit(false);
                setLimitType('shop-limit');
                // В случае ошибки тоже используем FREE план
                setOwnerPlan('FREE');
            } finally {
                setLoading(false);
                // Устанавливаем флаг загрузки в любом случае
                setIsOwnerPlanLoaded(true);
                console.log('✅ Owner plan load completed');
            }
        };

        if (!isAuthLoading) {
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
        ownerPlan,
        isOwnerPlanLoaded,
        handleSubmit,
    };
};
