/**
 * Интерфейс для Instagram пользователя
 */
export interface InstagramUser {
    /** ID пользователя в Instagram */
    id: string;
    /** Username в Instagram */
    username: string;
    /** Тип аккаунта Instagram */
    account_type: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
    /** Количество медиа файлов (опционально) */
    media_count?: number;
}

/**
 * Основной интерфейс пользователя в системе
 */
export interface User {
    /** Уникальный идентификатор Firebase */
    uid: string;
    /** ID Instagram аккаунта */
    instagramId: string;
    /** Username Instagram */
    username: string;
    /** Email пользователя (опционально) */
    email?: string;
    /** Отображаемое имя */
    displayName: string;
    /** URL фото профиля */
    profilePicture?: string;
    /** Тип аккаунта */
    accountType: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
    /** Статус аккаунта (для модерации новых пользователей) */
    accountStatus?: 'pending' | 'active' | 'rejected';

    /** Название магазина */
    storeName?: string;
    /** Описание магазина */
    storeDescription?: string;
    /** Категория магазина */
    storeCategory?: string;

    /** Информация о подписке */
    subscription: UserSubscription;

    /** Настройки сбора отзывов */
    reviewSettings: {
        /** Разрешить загрузку фото */
        allowPhotos: boolean;
        /** Требовать email */
        requireEmail: boolean;
        /** Публичное отображение включено */
        publicDisplayEnabled: boolean;
        /** Кастомное сообщение для клиентов */
        customMessage?: string;
    };

    /** Дата создания аккаунта */
    createdAt: Date;
    /** Дата последнего обновления */
    updatedAt: Date;
}

/**
 * Информация о подписке пользователя
 */
export interface UserSubscription {
    /** Тарифный план */
    plan: 'FREE' | 'PRO' | 'BUSINESS';
    /** Статус подписки */
    status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
    /** Лимит отзывов по плану */
    reviewsLimit: number;
    /** Использовано отзывов */
    reviewsUsed: number;
    /** Дата начала подписки */
    startDate: Date;
    /** Дата окончания подписки */
    endDate?: Date;
    /** Дата продления подписки */
    renewalDate?: Date;
}
