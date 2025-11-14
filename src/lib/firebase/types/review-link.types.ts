/**
 * Интерфейс для ссылок отзывов
 */
export interface ReviewLink {
    /** Уникальный ID ссылки */
    id: string;
    /** ID владельца магазина */
    storeOwnerId: string;
    /** Активна ли ссылка */
    isActive: boolean;
    /** Количество использований ссылки */
    usageCount: number;
    /** Максимальное количество использований (необязательно) */
    maxUsage?: number;
    /** Кастомное сообщение для клиента (необязательно) */
    customMessage?: string;
    /** Дата создания ссылки */
    createdAt: Date;
    /** Дата последнего обновления */
    updatedAt: Date;
    /** Дата истечения срока действия (необязательно) */
    expiresAt?: Date;
}

/**
 * Опции для создания новой ссылки отзыва
 */
export interface CreateReviewLinkOptions {
    /** Кастомное сообщение для клиента */
    customMessage?: string;
    /** Максимальное количество использований */
    maxUsage?: number;
    /** Дата истечения срока действия */
    expiresAt?: Date;
}
