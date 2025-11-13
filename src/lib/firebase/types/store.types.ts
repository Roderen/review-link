/**
 * Настройки магазина для сбора отзывов
 */
export interface StoreSettings {
    /** Разрешить клиентам загружать фотографии */
    allowPhotos: boolean;
    /** Требовать email от клиентов */
    requireEmail: boolean;
    /** Публичное отображение отзывов включено */
    publicDisplayEnabled: boolean;
    /** Кастомное приветственное сообщение */
    customMessage?: string;
}
