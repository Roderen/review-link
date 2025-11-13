import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import type { User } from '@/lib/firebase/types/user.types';

/**
 * Название коллекции пользователей в Firestore
 */
const USERS_COLLECTION = 'users';

/**
 * Подписывается на изменения профиля пользователя в реальном времени
 * @param uid - Уникальный идентификатор пользователя
 * @param callback - Функция обратного вызова, вызываемая при изменениях
 * @returns Функция для отписки от обновлений
 *
 * @example
 * const unsubscribe = subscribeToUserProfile('user123', (user) => {
 *   if (user) {
 *     console.log('Обновленные данные:', user.name);
 *   }
 * });
 *
 * // Позже, для отписки:
 * unsubscribe();
 */
export const subscribeToUserProfile = (
    uid: string,
    callback: (user: User | null) => void
): (() => void) => {
    const userDoc = doc(db, USERS_COLLECTION, uid);

    return onSnapshot(userDoc, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const user: User = {
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
            callback(user);
        } else {
            callback(null);
        }
    });
};
