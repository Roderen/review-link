/**
 * Сервисы авторизации
 * Обработка входа через Google и управление сессией
 */

export {
    signInWithGoogle,
    signOut,
    getCurrentUser,
    onAuthStateChanged,
} from './auth.service';

export type { AuthResult } from './auth.service';
