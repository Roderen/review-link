/**
 * Конфигурация Firebase и приложения
 * Центральная точка для всех настроек и констант
 */

// Firebase конфигурация
export { auth, provider, db, storage, functions } from './firebase-config';

// Тарифные планы
export {
    PLAN_LIMITS,
    SUBSCRIPTION_PLANS,
    PLANS, // deprecated
    getPlanLimits,
    getPlanDetails,
    isValidPlanType,
} from './subscription-plans';

export type { PlanConfig, PlanType, Plans } from './subscription-plans';
