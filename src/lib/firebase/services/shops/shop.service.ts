import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config/firebase-config';

/**
 * Название коллекции пользователей (владельцев магазинов) в Firestore
 */
const USERS_COLLECTION = 'users';

/**
 * Публичная информация о магазине
 */
export interface ShopPublicInfo {
    /** ID магазина */
    id: string;
    /** Название магазина */
    name: string;
    /** URL аватара магазина */
    avatar: string;
    /** Описание магазина */
    description: string;
    /** Instagram аккаунт магазина */
    instagram: string;
}

/**
 * Получение публичной информации о магазине по ID
 * Используется на публичной странице отзывов
 * @param shopId - ID магазина (равен ID пользователя-владельца)
 * @returns Promise<ShopPublicInfo> - Публичная информация о магазине
 * @throws Error если магазин не найден или произошла ошибка
 *
 * @example
 * const shop = await getShopById('user123');
 * console.log(shop.name); // 'Моя Мастерская'
 */
export const getShopById = async (shopId: string): Promise<ShopPublicInfo> => {
    try {
        const shopDoc = await getDoc(doc(db, USERS_COLLECTION, shopId));

        if (!shopDoc.exists()) {
            throw new Error('Магазин не найден');
        }

        const data = shopDoc.data();

        // Возвращаем только публичную информацию
        return {
            id: shopDoc.id,
            name: data.username || '',
            avatar: data.profilePicture || '',
            description: data.description || '',
            instagram: data.instagram || '',
        };
    } catch (error) {
        console.error('Ошибка получения данных магазина:', error);
        throw error;
    }
};
