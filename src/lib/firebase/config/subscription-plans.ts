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
export type PlanType = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

/**
 * Карта тарифных планов для валидации и проверки лимитов
 * Используется в сервисах для быстрой проверки лимитов
 */
export const PLAN_LIMITS: Record<PlanType, PlanConfig> = {
    FREE: {
        name: 'Бесплатный',
        maxReviews: 10,
    },
    BASIC: {
        name: 'Базовый',
        maxReviews: 100,
    },
    PREMIUM: {
        name: 'Премиум',
        maxReviews: 500,
    },
    ENTERPRISE: {
        name: 'Корпоративный',
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
            'Базовая статистика',
            'Email поддержка',
        ],
    },
    {
        id: 'basic',
        name: 'BASIC',
        displayName: 'Базовый',
        price: 999,
        currency: 'USD',
        reviewsLimit: 100,
        features: [
            'До 100 отзывов',
            'Расширенная статистика',
            'Приоритетная поддержка',
            'Кастомизация виджета',
        ],
    },
    {
        id: 'premium',
        name: 'PREMIUM',
        displayName: 'Премиум',
        price: 2999,
        currency: 'USD',
        reviewsLimit: 500,
        features: [
            'До 500 отзывов',
            'Полная аналитика',
            'VIP поддержка 24/7',
            'Кастомизация виджета',
            'API доступ',
            'Экспорт данных',
        ],
        isPopular: true,
    },
    {
        id: 'enterprise',
        name: 'ENTERPRISE',
        displayName: 'Корпоративный',
        price: 9999,
        currency: 'USD',
        reviewsLimit: Infinity,
        features: [
            'Безлимитные отзывы',
            'Расширенная аналитика',
            'Персональный менеджер',
            'Полная кастомизация',
            'API доступ',
            'Экспорт данных',
            'SLA гарантия',
            'White-label решение',
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
    return ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'].includes(value);
};

// Обратная совместимость со старым plans.ts
export interface Plans {
    free: PlanConfig;
    business: PlanConfig;
    pro: PlanConfig;
}

/**
 * @deprecated Используйте PLAN_LIMITS вместо этого
 * Оставлено для обратной совместимости
 */
export const PLANS: Plans = {
    free: PLAN_LIMITS.FREE,
    business: PLAN_LIMITS.PREMIUM,
    pro: PLAN_LIMITS.ENTERPRISE,
};
