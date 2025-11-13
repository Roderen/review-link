import type { User } from './user.types';

/**
 * Ответ от Instagram API при авторизации
 */
export interface InstagramAuthResponse {
    /** Access token для API запросов */
    access_token: string;
    /** ID пользователя в Instagram */
    user_id: string;
}

/**
 * Результат авторизации через Firebase
 */
export interface FirebaseAuthResult {
    /** Объект пользователя */
    user: User;
    /** Новый ли это пользователь (первый вход) */
    isNewUser: boolean;
}
