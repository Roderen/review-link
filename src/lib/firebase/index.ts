/**
 * Главный файл экспорта Firebase сервисов
 * Центральная точка для импорта всех Firebase функций и типов
 *
 * @example
 * // Можно импортировать все из одного места:
 * import {
 *   signInWithGoogle,
 *   getUserProfile,
 *   createReview,
 *   uploadReviewPhoto,
 *   db,
 *   SUBSCRIPTION_PLANS
 * } from '@/lib/firebase';
 */

// ============================================================================
// КОНФИГУРАЦИЯ
// ============================================================================

export {
    auth,
    provider,
    db,
    storage,
    functions,
    PLAN_LIMITS,
    SUBSCRIPTION_PLANS,
    PLANS, // deprecated
    getPlanLimits,
    getPlanDetails,
    isValidPlanType,
} from './config';

export type { PlanConfig, PlanType, Plans } from './config';

// ============================================================================
// ТИПЫ
// ============================================================================

export type {
    // User types
    InstagramUser,
    User,
    UserSubscription,
    // Review types
    Review,
    CreatePublicReviewData,
    ReviewQueryOptions,
    ReviewStats,
    SubmitReviewParams,
    ReviewQueryResult,
    // Review Link types
    ReviewLink,
    CreateReviewLinkOptions,
    // Store types
    StoreSettings,
    // Subscription types
    SubscriptionPlan,
    // Storage types
    UploadProgress,
    UploadResult,
    // API types
    InstagramAuthResponse,
    FirebaseAuthResult,
    // Stats types
    ReviewStatsResult,
    DashboardStatsResult,
    SubscriptionStats,
    LinksStats,
} from './types';

// ============================================================================
// AUTH СЕРВИСЫ
// ============================================================================

export {
    signInWithGoogle,
    signOut,
    getCurrentUser,
    onAuthStateChanged,
} from './services/auth';

export type { AuthResult } from './services/auth';

// ============================================================================
// USER СЕРВИСЫ
// ============================================================================

export {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    subscribeToUserProfile,
} from './services/users';

// ============================================================================
// REVIEW СЕРВИСЫ
// ============================================================================

export {
    // CRUD операции
    submitReview,
    createReview,
    createPublicReview,
    updateReview,
    deleteReview,
    // Запросы
    getReviewsStats,
    getReviewsForShop,
    getPublicReviews,
    getReviewsCount,
    getReviewsByStoreOwner,
    // Валидация
    canSubmitReview,
    canUseReviewLink,
    // Подписки
    subscribeToReviews,
} from './services/reviews';

// ============================================================================
// REVIEW LINK СЕРВИСЫ
// ============================================================================

export {
    createReviewLink,
    getReviewLinks,
    getReviewLink,
    updateReviewLink,
    deactivateReviewLink,
} from './services/review-links';

// ============================================================================
// SHOP СЕРВИСЫ
// ============================================================================

export {
    getShopById,
} from './services/shops';

// ============================================================================
// STATS СЕРВИСЫ
// ============================================================================

export {
    getReviewStats,
    getDashboardStats,
} from './services/stats';

// ============================================================================
// STORAGE СЕРВИСЫ
// ============================================================================

export {
    // Review photos
    uploadReviewPhoto,
    uploadMultipleReviewPhotos,
    // User avatars
    uploadUserAvatar,
    // Store logos
    uploadStoreLogo,
} from './services/storage';
