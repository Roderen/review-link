/**
 * Интерфейс для отслеживания прогресса загрузки
 */
export interface UploadProgress {
    /** Количество переданных байт */
    bytesTransferred: number;
    /** Общее количество байт */
    totalBytes: number;
    /** Процент выполнения (0-100) */
    percentage: number;
}

/**
 * Результат успешной загрузки файла
 */
export interface UploadResult {
    /** URL загруженного файла */
    url: string;
    /** Путь к файлу в хранилище */
    path: string;
    /** Имя файла */
    filename: string;
    /** Размер файла в байтах */
    size: number;
}
