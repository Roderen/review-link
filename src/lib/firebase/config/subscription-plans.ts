import type { SubscriptionPlan } from '@/lib/firebase/types/subscription.types';

/**
 * Конфигурация тарифного плана для внутреннего использования
 */
export interface PlanConfig {
    /** Отображаемое название плана */
    name: string;
    /** Максимальное количество отзывов */
    maxReviews: number;
}

/**
 * Типы доступных тарифных планов
 */
export type PlanType = 'FREE' | 'PRO' | 'BUSINESS';

/**
 * Карта тарифных планов для валидации и проверки лимитов
 * Используется в сервисах для быстрой проверки лимитов
 */
export const PLAN_LIMITS: Record<PlanType, PlanConfig> = {
    FREE: {
        name: 'Бесплатный',
        maxReviews: 10,
    },
    PRO: {
        name: 'Про',
        maxReviews: 100,
    },
    BUSINESS: {
        name: 'Бизнес',
        maxReviews: Infinity,
    },
};

/**
 * Полная конфигурация тарифных планов с деталями для UI
 * Используется на страницах ценообразования и в админ-панели
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'FREE',
        displayName: 'Бесплатный',
        price: 0,
        currency: 'USD',
        reviewsLimit: 10,
        features: [
            'До 10 отзывов',
            'Публичная страница отзывов',
            'Статистика отзывов',
        ],
    },
    {
        id: 'pro',
        name: 'PRO',
        displayName: 'Про',
        price: 799,
        currency: 'USD',
        reviewsLimit: 100,
        features: [
            'До 100 отзывов',
            'Загрузка фото (до 3 на отзыв)',
            'Статистика отзывов',
            'Email поддержка',
        ],
        isPopular: true,
    },
    {
        id: 'business',
        name: 'BUSINESS',
        displayName: 'Бизнес',
        price: 1499,
        currency: 'USD',
        reviewsLimit: Infinity,
        features: [
            'Безлимитные отзывы',
            'Загрузка фото и видео (до 5 на отзыв)',
            'Статистика отзывов',
            'Приоритетная поддержка',
        ],
    },
];

/**
 * Получает конфигурацию лимитов плана по его типу
 * @param planType - Тип тарифного плана
 * @returns Конфигурация лимитов плана
 *
 * @example
 * const limits = getPlanLimits('FREE');
 * console.log(limits.maxReviews); // 10
 */
export const getPlanLimits = (planType: PlanType): PlanConfig => {
    return PLAN_LIMITS[planType] || PLAN_LIMITS.FREE;
};

/**
 * Получает полную информацию о плане по его типу
 * @param planType - Тип тарифного плана
 * @returns Полная информация о плане или undefined
 *
 * @example
 * const plan = getPlanDetails('PREMIUM');
 * console.log(plan?.displayName); // 'Премиум'
 */
export const getPlanDetails = (planType: PlanType): SubscriptionPlan | undefined => {
    return SUBSCRIPTION_PLANS.find(plan => plan.name === planType);
};

/**
 * Проверяет, является ли строка валидным типом плана
 * @param value - Значение для проверки
 * @returns true если значение является валидным типом плана
 *
 * @example
 * isValidPlanType('FREE'); // true
 * isValidPlanType('INVALID'); // false
 */
export const isValidPlanType = (value: string): value is PlanType => {
    return ['FREE', 'PRO', 'BUSINESS'].includes(value);
};

// Обратная совместимость со старым plans.ts
export interface Plans {
    free: PlanConfig;
    pro: PlanConfig;
    business: PlanConfig;
}

/**
 * @deprecated Используйте PLAN_LIMITS вместо этого
 * Оставлено для обратной совместимости
 */
export const PLANS: Plans = {
    free: PLAN_LIMITS.FREE,
    pro: PLAN_LIMITS.PRO,
    business: PLAN_LIMITS.BUSINESS,
};
