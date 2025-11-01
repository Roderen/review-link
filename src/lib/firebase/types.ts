// src/lib/firebase/types.ts

export interface InstagramUser {
    id: string;
    username: string;
    account_type: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
    media_count?: number;
}

export interface User {
    uid: string;
    instagramId: string;
    username: string;
    email?: string;
    displayName: string;
    profilePicture?: string;
    accountType: 'PERSONAL' | 'BUSINESS' | 'CREATOR';

    // Информация о магазине (в профиле пользователя)
    storeName?: string;
    storeDescription?: string;
    storeCategory?: string;

    subscription: UserSubscription;

    // Настройки сбора отзывов
    reviewSettings: {
        allowPhotos: boolean;
        requireEmail: boolean;
        publicDisplayEnabled: boolean;
        customMessage?: string;
    };

    createdAt: Date;
    updatedAt: Date;
}

export interface UserSubscription {
    plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
    reviewsLimit: number;
    reviewsUsed: number;
    startDate: Date;
    endDate?: Date;
    renewalDate?: Date;
}

export interface Review {
    id: string;
    storeOwnerId: string; // uid владельца магазина
    customerName: string;
    customerEmail?: string;
    rating: number; // 1-5
    title?: string;
    content: string;
    photos?: string[]; // URLs фотографий
    isPublic: boolean; // всегда true при создании (нет модерации)
    createdAt: Date;
    updatedAt: Date;
    metadata?: {
        ipAddress?: string;
        userAgent?: string;
        source: 'DIRECT_LINK'; // всегда DIRECT_LINK
        reviewToken?: string; // токен ссылки
    };
}

export interface ReviewLink {
    id: string;
    storeOwnerId: string;
    isActive: boolean;
    usageCount: number;
    maxUsage?: number;
    customMessage?: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}

// Убираем интерфейс Store так как все хранится в User
// export interface Store - удален

export interface StoreSettings {
    allowPhotos: boolean;
    requireEmail: boolean;
    publicDisplayEnabled: boolean;
    customMessage?: string;
}

export interface SubscriptionPlan {
    id: string;
    name: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    displayName: string;
    price: number;
    currency: 'USD';
    reviewsLimit: number;
    features: string[];
    isPopular?: boolean;
}

// API Response типы
export interface InstagramAuthResponse {
    access_token: string;
    user_id: string;
}

export interface FirebaseAuthResult {
    user: User;
    isNewUser: boolean;
}

// Типы для создания публичного отзыва
export interface CreatePublicReviewData {
    customerName: string;
    customerEmail?: string;
    rating: number;
    title?: string;
    content: string;
    photos?: string[];
    metadata?: {
        ipAddress?: string;
        userAgent?: string;
    };
}

// Статистика
export interface ReviewStats {
    totalReviews: number;
    publicReviews: number;
    recentReviews: number;
    averageRating: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export interface DashboardStats {
    subscription: {
        plan: string;
        reviewsLimit: number;
        reviewsUsed: number;
        reviewsRemaining: number;
        usagePercentage: number;
    };
    reviews: ReviewStats;
    links: {
        total: number;
        active: number;
        totalUsage: number;
    };
}