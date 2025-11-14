/**
 * Центральный файл экспорта всех типов Firebase
 * Объединяет типы из разных доменов для удобного импорта
 */

// User types
export type { InstagramUser, User, UserSubscription } from './user.types';

// Review types
export type {
    Review,
    CreatePublicReviewData,
    ReviewQueryOptions,
    ReviewStats,
    SubmitReviewParams,
    ReviewQueryResult,
} from './review.types';

// Review Link types
export type { ReviewLink, CreateReviewLinkOptions } from './review-link.types';

// Store types
export type { StoreSettings } from './store.types';

// Subscription types
export type { SubscriptionPlan } from './subscription.types';

// Storage types
export type { UploadProgress, UploadResult } from './storage.types';

// API types
export type { InstagramAuthResponse, FirebaseAuthResult } from './api.types';

// Stats types (re-exported from services)
export type {
    ReviewStatsResult,
} from '../services/stats/review.stats';

export type {
    DashboardStatsResult,
    SubscriptionStats,
    LinksStats,
} from '../services/stats/dashboard.stats';
