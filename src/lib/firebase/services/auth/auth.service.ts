import { signInWithPopup, type User as FirebaseUser } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase/config/firebase-config';
import { getUserProfile, createUserProfile } from '@/lib/firebase/services/users';
import type { User } from '@/lib/firebase/types/user.types';

/**
 * Результат авторизации
 */
export interface AuthResult {
    /** Профиль пользователя */
    user: User;
    /** Флаг - новый ли это пользователь */
    isNewUser: boolean;
    /** Firebase User объект */
    firebaseUser: FirebaseUser;
}

/**
 * Авторизация через Google с автоматическим созданием профиля
 * Если пользователь входит впервые, создается новый профиль с планом FREE
 * @returns Promise<AuthResult> - Результат авторизации с данными пользователя
 * @throws Error если авторизация не удалась
 *
 * @example
 * try {
 *   const { user, isNewUser } = await signInWithGoogle();
 *   if (isNewUser) {
 *     console.log('Добро пожаловать!');
 *   } else {
 *     console.log('С возвращением!');
 *   }
 * } catch (error) {
 *   console.error('Ошибка авторизации:', error);
 * }
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
        // Авторизуемся через Google
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;

        // Проверяем, существует ли профиль пользователя
        let userProfile = await getUserProfile(firebaseUser.uid);
        let isNewUser = false;

        // Если профиля нет - создаем новый
        if (!userProfile) {
            isNewUser = true;

            // Создаем профиль с базовыми данными
            userProfile = await createUserProfile({
                uid: firebaseUser.uid,
                instagramId: '', // Будет заполнено при связывании Instagram
                username: firebaseUser.displayName || 'User',
                email: firebaseUser.email || undefined,
                displayName: firebaseUser.displayName || 'User',
                profilePicture: firebaseUser.photoURL || undefined,
                accountType: 'PERSONAL' as const, // ✅ Исправлено: добавлен as const
                accountStatus: 'pending',
                role: 'user',

                // Инициализация подписки FREE
                subscription: {
                    plan: 'FREE',
                    status: 'ACTIVE',
                    reviewsLimit: 10,
                    reviewsUsed: 0,
                    startDate: new Date(),
                },

                // Настройки по умолчанию
                reviewSettings: {
                    allowPhotos: true,
                    requireEmail: false,
                    publicDisplayEnabled: true,
                },

                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // ✅ Исправлено: проверка на null
        if (!userProfile) {
            throw new Error('Не удалось создать или получить профиль пользователя');
        }

        return {
            user: userProfile,
            isNewUser,
            firebaseUser,
        };
    } catch (error) {
        console.error('Ошибка авторизации через Google:', error);
        throw new Error('Не удалось выполнить вход через Google');
    }
};

/**
 * Выход из аккаунта
 * @returns Promise<void>
 * @throws Error если не удалось выйти
 *
 * @example
 * await signOut();
 * console.log('Вы вышли из аккаунта');
 */
export const signOut = async (): Promise<void> => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Ошибка выхода из аккаунта:', error);
        throw new Error('Не удалось выйти из аккаунта');
    }
};

/**
 * Получает текущего авторизованного пользователя Firebase
 * @returns FirebaseUser | null - Пользователь Firebase или null
 *
 * @example
 * const currentUser = getCurrentUser();
 * if (currentUser) {
 *   console.log('UID:', currentUser.uid);
 * }
 */
export const getCurrentUser = (): FirebaseUser | null => {
    return auth.currentUser;
};

/**
 * Подписывается на изменения состояния авторизации
 * @param callback - Функция, вызываемая при изменении состояния
 * @returns Функция для отписки
 *
 * @example
 * const unsubscribe = onAuthStateChanged((user) => {
 *   if (user) {
 *     console.log('Пользователь авторизован:', user.uid);
 *   } else {
 *     console.log('Пользователь не авторизован');
 *   }
 * });
 *
 * // Отписаться позже
 * unsubscribe();
 */
export const onAuthStateChanged = (
    callback: (user: FirebaseUser | null) => void
): (() => void) => {
    return auth.onAuthStateChanged(callback);
};