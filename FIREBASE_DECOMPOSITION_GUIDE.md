# Firebase Services Decomposition Guide

## 📋 Оглавление
- [Текущая структура и проблемы](#текущая-структура-и-проблемы)
- [Предлагаемая архитектура](#предлагаемая-архитектура)
- [Правила декомпозиции](#правила-декомпозиции)
- [Примеры декомпозиции](#примеры-декомпозиции)
- [Миграционный план](#миграционный-план)

---

## 🔍 Текущая структура и проблемы

### Существующие файлы:
```
lib/firebase/
├── auth.ts (25 строк) ✅ OK
├── firebase-config.ts (20 строк) ✅ OK
├── firebase.ts (2 строки) ✅ OK
├── firestore.ts (608 строк) ❌ ТРЕБУЕТ ДЕКОМПОЗИЦИИ
├── plans.ts (25 строк) ✅ OK
├── reviewServise.ts (318 строк) ⚠️ ТРЕБУЕТ ДЕКОМПОЗИЦИИ
├── storage.ts (249 строк) ⚠️ ТРЕБУЕТ ДЕКОМПОЗИЦИИ
└── types.ts (151 строка) ⚠️ ТРЕБУЕТ ДЕКОМПОЗИЦИИ
```

### Проблемы:

1. **firestore.ts (608 строк)** - "God Object" антипаттерн
   - Смешивает разные домены: users, reviews, links, stats
   - Сложно поддерживать и тестировать
   - Нарушает Single Responsibility Principle

2. **reviewServise.ts (318 строк)**
   - Дублирует часть функционала из firestore.ts
   - Непонятно какой сервис использовать для работы с отзывами
   - Смешивает бизнес-логику и данные

3. **types.ts (151 строка)**
   - Все типы в одном файле
   - Сложно найти нужный тип
   - Нет группировки по доменам

4. **storage.ts (249 строк)**
   - Смешивает загрузку разных типов файлов
   - Можно разделить по назначению

---

## 🏗️ Предлагаемая архитектура

### Новая структура:

```
lib/firebase/
├── config/                           # Конфигурация
│   ├── firebase-config.ts           # Firebase инициализация
│   ├── plans.ts                     # Тарифные планы
│   └── index.ts                     # Re-export
│
├── types/                            # Типы, сгруппированные по доменам
│   ├── user.types.ts                # User, UserSubscription, InstagramUser
│   ├── review.types.ts              # Review, ReviewLink, CreatePublicReviewData
│   ├── subscription.types.ts        # SubscriptionPlan
│   ├── stats.types.ts               # ReviewStats, DashboardStats
│   ├── store.types.ts               # StoreSettings
│   ├── api.types.ts                 # API response types
│   └── index.ts                     # Re-export всех типов
│
├── services/                         # Сервисы для работы с данными
│   │
│   ├── users/                        # Домен: Пользователи
│   │   ├── user.service.ts          # CRUD операции с пользователями
│   │   │   - createUserProfile()
│   │   │   - getUserProfile()
│   │   │   - updateUserProfile()
│   │   ├── user.subscriptions.ts    # Real-time подписки на пользователей
│   │   │   - subscribeToUserProfile()
│   │   └── index.ts                 # Re-export
│   │
│   ├── reviews/                      # Домен: Отзывы
│   │   ├── review.service.ts        # CRUD операции с отзывами
│   │   │   - createReview()
│   │   │   - updateReview()
│   │   │   - deleteReview()
│   │   │   - submitReview()
│   │   ├── review.queries.ts        # Сложные запросы, фильтрация
│   │   │   - getReviewsForShop()
│   │   │   - getPublicReviews()
│   │   │   - getReviewsByStoreOwner()
│   │   │   - getReviewsCount()
│   │   ├── review.validation.ts     # Валидация и проверки
│   │   │   - canSubmitReview()
│   │   │   - canUseReviewLink()
│   │   ├── review.subscriptions.ts  # Real-time подписки
│   │   │   - subscribeToReviews()
│   │   └── index.ts                 # Re-export
│   │
│   ├── review-links/                 # Домен: Ссылки для отзывов
│   │   ├── review-link.service.ts   # CRUD операции со ссылками
│   │   │   - createReviewLink()
│   │   │   - getReviewLinks()
│   │   │   - getReviewLink()
│   │   │   - updateReviewLink()
│   │   │   - deactivateReviewLink()
│   │   └── index.ts                 # Re-export
│   │
│   ├── stats/                        # Домен: Статистика
│   │   ├── review.stats.ts          # Статистика отзывов
│   │   │   - getReviewStats()
│   │   │   - getPublicReviewsStats()
│   │   ├── dashboard.stats.ts       # Статистика для дашборда
│   │   │   - getDashboardStats()
│   │   └── index.ts                 # Re-export
│   │
│   ├── storage/                      # Домен: Хранилище файлов
│   │   ├── review-photos.ts         # Загрузка фото к отзывам
│   │   │   - uploadReviewPhoto()
│   │   │   - uploadMultipleReviewPhotos()
│   │   ├── user-avatars.ts          # Загрузка аватаров пользователей
│   │   │   - uploadUserAvatar()
│   │   ├── store-logos.ts           # Загрузка логотипов магазинов
│   │   │   - uploadStoreLogo()
│   │   └── index.ts                 # Re-export
│   │
│   └── shops/                        # Домен: Магазины (публичные данные)
│       ├── shop.service.ts          # Публичные данные магазина
│       │   - getShopById()
│       └── index.ts                 # Re-export
│
├── auth/                             # Авторизация
│   ├── auth.ts                      # Авторизация через Google/Instagram
│   └── index.ts                     # Re-export
│
└── index.ts                          # Главный экспорт всех сервисов
```

---

## 📏 Правила декомпозиции

### 1. Принцип единственной ответственности (SRP)
- Каждый файл отвечает за **один домен** или **одну функцию**
- Максимальный размер файла: **200-250 строк**
- Если файл больше 250 строк - делим на подфайлы

### 2. Группировка по доменам
**Домены в проекте:**
- Users (пользователи)
- Reviews (отзывы)
- Review Links (ссылки для отзывов)
- Stats (статистика)
- Storage (хранилище файлов)
- Shops (магазины - публичные данные)
- Auth (авторизация)

### 3. Типы файлов в каждом домене

#### `*.service.ts` - CRUD операции
- Create (создание)
- Read (чтение)
- Update (обновление)
- Delete (удаление)

**Пример:** `user.service.ts`
```typescript
export const createUserProfile = async (userData) => { ... }
export const getUserProfile = async (uid) => { ... }
export const updateUserProfile = async (uid, updates) => { ... }
export const deleteUserProfile = async (uid) => { ... }
```

#### `*.queries.ts` - Сложные запросы
- Фильтрация
- Сортировка
- Пагинация
- Поиск
- Агрегация данных

**Пример:** `review.queries.ts`
```typescript
export const getReviewsForShop = async (shopId, options) => { ... }
export const getPublicReviews = async (shopId, filters) => { ... }
export const searchReviews = async (query) => { ... }
```

#### `*.validation.ts` - Валидация и проверки
- Проверка прав доступа
- Валидация данных
- Проверка лимитов
- Бизнес-правила

**Пример:** `review.validation.ts`
```typescript
export const canSubmitReview = async (shopId) => { ... }
export const canUseReviewLink = async (linkId) => { ... }
export const validateReviewData = (data) => { ... }
```

#### `*.subscriptions.ts` - Real-time подписки
- onSnapshot подписки
- Real-time обновления

**Пример:** `review.subscriptions.ts`
```typescript
export const subscribeToReviews = (shopId, callback) => { ... }
export const subscribeToReviewUpdates = (reviewId, callback) => { ... }
```

### 4. Именование файлов и функций

#### Файлы:
- Используй **kebab-case**: `review-link.service.ts`
- Суффиксы обязательны: `.service.ts`, `.queries.ts`, `.validation.ts`, `.types.ts`

#### Функции:
- Используй **camelCase**: `getUserProfile`, `createReview`
- Префиксы по операциям:
  - `get*` - получение данных
  - `create*` - создание
  - `update*` - обновление
  - `delete*` - удаление
  - `can*` - проверки возможности действия
  - `validate*` - валидация данных
  - `subscribeTo*` - real-time подписки

#### Типы:
- Используй **PascalCase**: `User`, `Review`, `ReviewLink`
- Суффиксы для типов:
  - Интерфейсы данных: `User`, `Review` (без суффикса)
  - Параметры: `CreateUserParams`, `UpdateReviewParams`
  - Результаты: `ReviewQueryResult`, `StatsResult`
  - Опции: `ReviewQueryOptions`, `UploadOptions`

### 5. Структура index.ts файлов

Каждая папка должна иметь `index.ts` для re-export:

```typescript
// services/reviews/index.ts
export * from './review.service';
export * from './review.queries';
export * from './review.validation';
export * from './review.subscriptions';
```

### 6. Зависимости между доменами

**Правило:** Домены не должны импортировать друг друга напрямую.

❌ **Неправильно:**
```typescript
// reviews/review.service.ts
import { getUserProfile } from '../users/user.service';
```

✅ **Правильно:**
```typescript
// reviews/review.service.ts
// Если нужна информация о пользователе, передавай userId
// и получай данные на верхнем уровне
export const createReview = async (userId: string, reviewData) => {
  // userId уже получен, не нужно импортировать user.service
}
```

### 7. Общие утилиты

Если функция используется в **нескольких доменах**, вынеси её в `lib/utils/`:

```
lib/utils/
├── firebase-helpers.ts   # Общие Firebase утилиты
├── date-helpers.ts       # Работа с датами
└── validation.ts         # Общая валидация
```

---

## 💡 Примеры декомпозиции

### Пример 1: Декомпозиция User функций

**Было** (в firestore.ts):
```typescript
// Все в одном файле
export const createUserProfile = async (userData) => { ... }
export const getUserProfile = async (uid) => { ... }
export const updateUserProfile = async (uid, updates) => { ... }
export const subscribeToUserProfile = (uid, callback) => { ... }
```

**Стало**:

```typescript
// services/users/user.service.ts
export const createUserProfile = async (userData: CreateUserParams): Promise<User> => { ... }
export const getUserProfile = async (uid: string): Promise<User | null> => { ... }
export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => { ... }

// services/users/user.subscriptions.ts
export const subscribeToUserProfile = (
  uid: string,
  callback: (user: User | null) => void
): () => void => { ... }

// services/users/index.ts
export * from './user.service';
export * from './user.subscriptions';
```

### Пример 2: Декомпозиция Review функций

**Было** (распределено между firestore.ts и reviewServise.ts):
```typescript
// В firestore.ts
export const createReview = async (...) => { ... }
export const getReviewsByStoreOwner = async (...) => { ... }
export const updateReview = async (...) => { ... }
export const deleteReview = async (...) => { ... }

// В reviewServise.ts (дублирование!)
export const submitReview = async (...) => { ... }
export const getReviewsForShop = async (...) => { ... }
export const canSubmitReview = async (...) => { ... }
```

**Стало**:

```typescript
// services/reviews/review.service.ts
export const createReview = async (reviewData: CreateReviewParams): Promise<Review> => { ... }
export const submitReview = async (params: SubmitReviewParams): Promise<void> => { ... }
export const updateReview = async (reviewId: string, updates: Partial<Review>): Promise<void> => { ... }
export const deleteReview = async (reviewId: string, storeOwnerId: string): Promise<void> => { ... }

// services/reviews/review.queries.ts
export const getReviewsForShop = async (
  shopId: string,
  options: ReviewQueryOptions
): Promise<ReviewQueryResult> => { ... }
export const getReviewsByStoreOwner = async (
  ownerId: string,
  options: ReviewQueryOptions
): Promise<Review[]> => { ... }
export const getPublicReviews = async (shopId: string): Promise<Review[]> => { ... }
export const getReviewsCount = async (shopId: string): Promise<number> => { ... }

// services/reviews/review.validation.ts
export const canSubmitReview = async (shopOwnerId: string): Promise<boolean> => { ... }
export const canUseReviewLink = async (reviewLinkId: string): Promise<boolean> => { ... }

// services/reviews/review.subscriptions.ts
export const subscribeToReviews = (
  shopId: string,
  callback: (reviews: Review[]) => void
): () => void => { ... }

// services/reviews/index.ts
export * from './review.service';
export * from './review.queries';
export * from './review.validation';
export * from './review.subscriptions';
```

### Пример 3: Декомпозиция Storage функций

**Было** (storage.ts - все в одном):
```typescript
export const uploadReviewPhoto = async (...) => { ... }
export const uploadMultipleReviewPhotos = async (...) => { ... }
export const uploadUserAvatar = async (...) => { ... }
export const uploadStoreLogo = async (...) => { ... }
```

**Стало**:

```typescript
// services/storage/review-photos.ts
export const uploadReviewPhoto = async (
  file: File,
  reviewId: string,
  onProgress?: (progress: number) => void
): Promise<string> => { ... }

export const uploadMultipleReviewPhotos = async (
  files: File[],
  reviewId: string,
  onProgress?: (progress: number) => void
): Promise<string[]> => { ... }

// services/storage/user-avatars.ts
export const uploadUserAvatar = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> => { ... }

// services/storage/store-logos.ts
export const uploadStoreLogo = async (
  file: File,
  storeId: string,
  onProgress?: (progress: number) => void
): Promise<string> => { ... }

// services/storage/index.ts
export * from './review-photos';
export * from './user-avatars';
export * from './store-logos';
```

### Пример 4: Декомпозиция Types

**Было** (types.ts - все типы вместе):
```typescript
export interface User { ... }
export interface Review { ... }
export interface ReviewLink { ... }
export interface ReviewStats { ... }
// ... ещё 10+ интерфейсов
```

**Стало**:

```typescript
// types/user.types.ts
export interface User { ... }
export interface UserSubscription { ... }
export interface InstagramUser { ... }

// types/review.types.ts
export interface Review { ... }
export interface ReviewLink { ... }
export interface CreatePublicReviewData { ... }

// types/stats.types.ts
export interface ReviewStats { ... }
export interface DashboardStats { ... }

// types/subscription.types.ts
export interface SubscriptionPlan { ... }

// types/store.types.ts
export interface StoreSettings { ... }

// types/api.types.ts
export interface InstagramAuthResponse { ... }
export interface FirebaseAuthResult { ... }

// types/index.ts
export * from './user.types';
export * from './review.types';
export * from './stats.types';
export * from './subscription.types';
export * from './store.types';
export * from './api.types';
```

---

## 🔄 Миграционный план

### Шаг 1: Создать новую структуру папок
```bash
mkdir -p src/lib/firebase/{config,types,services/{users,reviews,review-links,stats,storage,shops},auth}
```

### Шаг 2: Перенести типы
1. Создать файлы типов в `types/`
2. Скопировать типы из старого `types.ts`
3. Создать `types/index.ts` с re-export
4. Обновить импорты в компонентах

### Шаг 3: Перенести конфигурацию
1. Переместить `firebase-config.ts` в `config/`
2. Переместить `plans.ts` в `config/`

### Шаг 4: Декомпозировать Users домен
1. Создать `services/users/user.service.ts`
2. Перенести функции из `firestore.ts`
3. Создать `services/users/user.subscriptions.ts`
4. Создать `services/users/index.ts`

### Шаг 5: Декомпозировать Reviews домен
1. Создать файлы в `services/reviews/`
2. Объединить функционал из `firestore.ts` и `reviewServise.ts`
3. Удалить дублирование

### Шаг 6: Декомпозировать остальные домены
- Review Links
- Stats
- Storage
- Shops

### Шаг 7: Обновить импорты во всём проекте
```typescript
// Было
import { getUserProfile } from '@/lib/firebase/firestore';

// Стало
import { getUserProfile } from '@/lib/firebase/services/users';
// или через главный index
import { getUserProfile } from '@/lib/firebase';
```

### Шаг 8: Удалить старые файлы
- `firestore.ts`
- `reviewServise.ts`
- Старый `types.ts`
- Старый `storage.ts`

---

## ✅ Checklist для создания нового домена

Когда создаёшь новый домен, следуй этому чеклисту:

- [ ] Создать папку домена в `services/`
- [ ] Создать `*.service.ts` с CRUD операциями
- [ ] Создать `*.queries.ts` если есть сложные запросы
- [ ] Создать `*.validation.ts` если есть проверки
- [ ] Создать `*.subscriptions.ts` если нужны real-time обновления
- [ ] Создать типы в `types/*.types.ts`
- [ ] Создать `index.ts` в папке домена с re-export
- [ ] Добавить экспорт в главный `lib/firebase/index.ts`
- [ ] Написать JSDoc комментарии для всех функций
- [ ] Добавить обработку ошибок

---

## 📚 Дополнительные правила

### 1. JSDoc комментарии
Каждая экспортируемая функция должна иметь JSDoc:

```typescript
/**
 * Создает новый профиль пользователя в Firestore
 * @param userData - Данные пользователя
 * @returns Promise с созданным профилем пользователя
 * @throws Error если не удалось создать профиль
 */
export const createUserProfile = async (
  userData: CreateUserParams
): Promise<User> => {
  // ...
}
```

### 2. Обработка ошибок
Всегда оборачивай Firebase операции в try-catch:

```typescript
export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);

    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as User;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to get user profile');
  }
}
```

### 3. Константы коллекций
Вынеси названия коллекций в константы:

```typescript
// services/users/user.service.ts
const USERS_COLLECTION = 'users';

export const getUserProfile = async (uid: string) => {
  const userDoc = doc(db, USERS_COLLECTION, uid);
  // ...
}
```

### 4. Типизация возвращаемых значений
Всегда указывай типы возвращаемых значений:

```typescript
// ❌ Плохо
export const getUserProfile = async (uid: string) => { ... }

// ✅ Хорошо
export const getUserProfile = async (uid: string): Promise<User | null> => { ... }
```

---

## 🎯 Итоговые преимущества

После декомпозиции получим:

✅ **Читаемость**: Легко найти нужную функцию
✅ **Поддерживаемость**: Каждый файл отвечает за одну задачу
✅ **Тестируемость**: Легко покрыть тестами маленькие модули
✅ **Переиспользуемость**: Чёткое разделение по доменам
✅ **Масштабируемость**: Легко добавлять новые домены
✅ **Отсутствие дублирования**: Один источник правды для каждой операции

---

## 📞 Когда использовать этот гайд

**Используй этот гайд когда:**
- Создаёшь новый Firebase сервис
- Добавляешь функционал в существующий домен
- Декомпозируешь большой файл (>250 строк)
- Рефакторишь существующий код

**Спроси себя перед созданием файла:**
1. Какой домен? (Users, Reviews, Stats, etc.)
2. Какой тип операции? (CRUD, Query, Validation, Subscription)
3. Есть ли уже похожий файл?
4. Размер файла после добавления < 250 строк?

Если ответы понятны - следуй структуре из этого гайда!

---

**Версия документа:** 1.0
**Дата создания:** 2025-01-13
**Автор:** Claude + Developer Team
