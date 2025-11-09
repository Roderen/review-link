/**
 * Утилита для генерации и управления уникальным идентификатором устройства
 * Используется для предотвращения спама отзывов с одного устройства
 */

const DEVICE_ID_KEY = 'review_device_id';

/**
 * Генерирует простой fingerprint на основе характеристик браузера/устройства
 */
function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.platform,
  ];

  // Создаем простой hash из компонентов
  const fingerprint = components.join('|');

  // Простая hash функция
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Генерирует случайный уникальный ID
 */
function generateRandomId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Получает или создает уникальный ID устройства
 * Комбинирует fingerprint и случайный ID для большей уникальности
 */
export function getDeviceId(): string {
  // Проверяем, есть ли уже сохраненный ID
  const existingId = localStorage.getItem(DEVICE_ID_KEY);

  if (existingId) {
    return existingId;
  }

  // Генерируем новый ID на основе fingerprint + random
  const fingerprint = generateFingerprint();
  const randomPart = generateRandomId();
  const deviceId = `${fingerprint}-${randomPart}`;

  // Сохраняем в localStorage
  try {
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  } catch (error) {
    console.error('Не удалось сохранить device ID в localStorage:', error);
  }

  return deviceId;
}

/**
 * Очищает сохраненный device ID (для тестирования)
 */
export function clearDeviceId(): void {
  localStorage.removeItem(DEVICE_ID_KEY);
}

/**
 * Проверяет, доступен ли localStorage
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
