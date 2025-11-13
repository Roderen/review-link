import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import type { User } from '@/lib/firebase/types';

/**
 * Название коллекции пользователей в Firestore
 */
const USERS_COLLECTION = 'users';

/**
 * Создает профиль пользователя в Firestore
 * @param userData - Данные пользователя без ID
 * @returns Promise<User> - Созданный профиль пользователя
 * @throws Error если не удалось создать профиль
 *
 * @example
 * const user = await createUserProfile({
 *   uid: 'user123',
 *   name: 'Иван Иванов',
 *   email: 'ivan@example.com',
 *   plan: 'free'
 * });
 */
export const createUserProfile = async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
        const userDoc = doc(db, USERS_COLLECTION, userData.uid);
        const userWithTimestamps = {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(userDoc, userWithTimestamps);

        return {
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error('Ошибка создания профиля пользователя:', error);
        throw new Error('Не удалось создать профиль пользователя');
    }
};

/**
 * Получает профиль пользователя по UID
 * @param uid - Уникальный идентификатор пользователя
 * @returns Promise<User | null> - Профиль пользователя или null если не найден
 * @throws Error если произошла ошибка при получении
 *
 * @example
 * const user = await getUserProfile('user123');
 * if (user) {
 *   console.log(user.name);
 * }
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
        const userDoc = doc(db, USERS_COLLECTION, uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                uid: docSnap.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                subscription: {
                    ...data.subscription,
                    startDate: data.subscription?.startDate?.toDate() || new Date(),
                    endDate: data.subscription?.endDate?.toDate(),
                    renewalDate: data.subscription?.renewalDate?.toDate(),
                },
            } as User;
        }

        return null;
    } catch (error) {
        console.error('Ошибка получения профиля пользователя:', error);
        throw new Error('Не удалось получить профиль пользователя');
    }
};

/**
 * Обновляет профиль пользователя
 * @param uid - Уникальный идентификатор пользователя
 * @param updates - Частичные данные для обновления
 * @returns Promise<void>
 * @throws Error если не удалось обновить профиль
 *
 * @example
 * await updateUserProfile('user123', {
 *   name: 'Новое Имя',
 *   plan: 'business'
 * });
 */
export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => {
    try {
        const userDoc = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userDoc, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Ошибка обновления профиля пользователя:', error);
        throw new Error('Не удалось обновить профиль пользователя');
    }
};
