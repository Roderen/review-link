/**
 * Генерирует уникальный ID для ссылки на отзыв
 * Каждая ссылка будет одноразовой - может быть использована только для одного отзыва
 */
export function generateReviewLinkId(): string {
  // Используем timestamp + случайная строка для уникальности
  const timestamp = Date.now().toString(36); // Конвертируем timestamp в base36
  const randomPart = Math.random().toString(36).substring(2, 15); // Случайная строка
  const randomPart2 = Math.random().toString(36).substring(2, 15); // Еще одна для большей уникальности

  return `${timestamp}-${randomPart}${randomPart2}`;
}
