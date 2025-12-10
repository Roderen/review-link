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
        console.log('🔍 [getShopById] Start fetching shop:', shopId);
        console.log('🔍 [getShopById] Collection:', USERS_COLLECTION);
        console.log('🔍 [getShopById] DB instance:', db ? 'exists' : 'null');
        console.log('🔍 [getShopById] DB app options:', {
            projectId: db?.app?.options?.projectId,
            authDomain: db?.app?.options?.authDomain
        });

        const docRef = doc(db, USERS_COLLECTION, shopId);
        console.log('🔍 [getShopById] Doc reference created:', docRef.path);

        console.log('📡 [getShopById] Calling getDoc...');
        const shopDoc = await getDoc(docRef);
        console.log('✅ [getShopById] getDoc completed, exists:', shopDoc.exists());

        if (!shopDoc.exists()) {
            console.error('❌ [getShopById] Document does not exist');
            throw new Error('Магазин не найден');
        }

        const data = shopDoc.data();
        console.log('✅ [getShopById] Document data:', data);

        const result = {
            id: shopDoc.id,
            name: data.username || data.displayName || '',
            avatar: data.profilePicture || data.avatar || '',
            description: data.description || data.storeDescription || '',
            instagram: data.instagram || '',
        };

        console.log('✅ [getShopById] Returning result:', result);
        return result;
    } catch (error) {
        console.error('❌ [getShopById] Error caught:', error);
        console.error('❌ [getShopById] Error type:', error.constructor?.name);
        console.error('❌ [getShopById] Error message:', error.message);
        console.error('❌ [getShopById] Error code:', error.code);
        console.error('❌ [getShopById] Full error:', error);
        throw error;
    }
};