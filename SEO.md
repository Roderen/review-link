# SEO Документация для владельца проекта

## Что было сделано

В проект интегрирован **react-helmet-async** - библиотека для управления мета-тегами в React приложениях. Это позволяет поисковым системам (Google, Яндекс) и социальным сетям (Facebook, Twitter) корректно отображать информацию о ваших страницах.

### Установленные зависимости
- `react-helmet-async@^2.0.5`

### Изменённые файлы
1. **src/App.tsx** - добавлен `HelmetProvider` (обёртка для всего приложения)
2. **src/pages/LandingPage.tsx** - добавлены SEO мета-теги для главной страницы
3. **src/pages/PricingPage.tsx** - добавлены SEO мета-теги для страницы с ценами

---

## Как добавлять SEO мета-теги на новые страницы

### Шаг 1: Импортируйте Helmet

В начале вашего файла страницы добавьте импорт:

```tsx
import { Helmet } from 'react-helmet-async';
```

### Шаг 2: Добавьте Helmet в компонент

Внутри `return` statement вашего компонента добавьте блок `<Helmet>` с мета-тегами:

```tsx
const MyPage = () => {
    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>Заголовок страницы - Instagram Reviews</title>
                <meta name="description" content="Описание страницы для поисковых систем (150-160 символов)" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Заголовок для Facebook/Instagram" />
                <meta property="og:description" content="Описание для Facebook/Instagram" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Заголовок для Twitter" />
                <meta name="twitter:description" content="Описание для Twitter" />

                {/* Keywords (опционально) */}
                <meta name="keywords" content="ключевые, слова, через, запятую" />
            </Helmet>

            {/* Остальной контент страницы */}
        </div>
    );
};
```

---

## Описание мета-тегов

### 1. `<title>` - Заголовок страницы
**Где отображается:** В результатах поиска Google, в названии вкладки браузера

**Рекомендации:**
- 50-60 символов максимум
- Включайте название бренда в конце (`- Instagram Reviews`)
- Описывайте суть страницы кратко и чётко

**Пример:**
```html
<title>Тарифы и цены - Instagram Reviews</title>
```

---

### 2. `<meta name="description">` - Описание страницы
**Где отображается:** Под заголовком в результатах поиска Google

**Рекомендации:**
- 150-160 символов
- Убедительное описание, которое побуждает кликнуть
- Включайте ключевые слова естественным образом

**Пример:**
```html
<meta name="description" content="Выберите подходящий тариф для вашего бизнеса. От бесплатного плана до безлимитных отзывов." />
```

---

### 3. Open Graph теги (Facebook, Instagram, LinkedIn)
**Где отображается:** При шаринге ссылки в социальных сетях

**Основные теги:**
- `og:type` - тип контента (обычно `website`)
- `og:title` - заголовок для соцсетей (может отличаться от `<title>`)
- `og:description` - описание для соцсетей
- `og:image` - URL изображения для превью (опционально)

**Пример:**
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Instagram Reviews - Сервис сбора отзывов" />
<meta property="og:description" content="Простой и удобный сервис для сбора отзывов от клиентов" />
<meta property="og:image" content="https://yoursite.com/og-image.jpg" />
```

---

### 4. Twitter Card теги
**Где отображается:** При шаринге ссылки в Twitter/X

**Основные теги:**
- `twitter:card` - тип карточки (`summary`, `summary_large_image`, `player`)
- `twitter:title` - заголовок для Twitter
- `twitter:description` - описание для Twitter
- `twitter:image` - URL изображения (опционально)

**Пример:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Instagram Reviews" />
<meta name="twitter:description" content="Сервис для сбора отзывов" />
```

---

### 5. Keywords (ключевые слова)
**Важно:** Google не использует этот тег для ранжирования! Но некоторые другие поисковые системы могут.

**Рекомендации:**
- 5-10 ключевых слов
- Релевантные содержанию страницы
- Через запятую

**Пример:**
```html
<meta name="keywords" content="отзывы, instagram, reviews, магазин, клиенты" />
```

---

## Примеры для разных типов страниц

### Пример 1: Главная страница
```tsx
<Helmet>
    <title>Instagram Reviews - Сервис сбора отзывов для Instagram магазинов</title>
    <meta name="description" content="Простой и удобный сервис для сбора и отображения отзывов от ваших клиентов. Получите персональную ссылку и начните собирать отзывы прямо сейчас." />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Instagram Reviews - Сервис сбора отзывов" />
    <meta property="og:description" content="Простой сервис для сбора отзывов от клиентов" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Instagram Reviews" />
    <meta name="twitter:description" content="Сервис сбора отзывов для Instagram магазинов" />

    <meta name="keywords" content="отзывы, instagram, reviews, магазин, клиенты" />
</Helmet>
```

### Пример 2: Страница с тарифами
```tsx
<Helmet>
    <title>Тарифы и цены - Instagram Reviews</title>
    <meta name="description" content="Выберите подходящий тариф для вашего бизнеса. От бесплатного плана до безлимитных отзывов. Начните собирать отзывы уже сегодня!" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Тарифы и цены - Instagram Reviews" />
    <meta property="og:description" content="Выберите подходящий тариф для вашего бизнеса" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Тарифы - Instagram Reviews" />
    <meta name="twitter:description" content="От бесплатного плана до безлимитных отзывов" />

    <meta name="keywords" content="pricing, тарифы, цены, подписка" />
</Helmet>
```

### Пример 3: Блог статья
```tsx
<Helmet>
    <title>Как увеличить конверсию с помощью отзывов - Instagram Reviews</title>
    <meta name="description" content="5 проверенных способов использования отзывов для увеличения продаж в Instagram. Практические советы и примеры." />

    <meta property="og:type" content="article" />
    <meta property="og:title" content="Как увеличить конверсию с помощью отзывов" />
    <meta property="og:description" content="5 проверенных способов использования отзывов" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Конверсия с отзывами" />
    <meta name="twitter:description" content="5 способов увеличить продажи" />

    <meta name="keywords" content="конверсия, отзывы, продажи, instagram, маркетинг" />
</Helmet>
```

---

## Полезные советы

### ✅ DO (Делайте):
- Пишите уникальные title и description для каждой страницы
- Используйте призыв к действию в description
- Проверяйте длину текста (title: 50-60 символов, description: 150-160)
- Включайте название бренда в title
- Тестируйте как выглядят превью в соцсетях

### ❌ DON'T (Не делайте):
- Не копируйте одинаковые мета-теги на разные страницы
- Не спамьте ключевыми словами
- Не используйте кликбейтные заголовки
- Не превышайте рекомендованную длину
- Не забывайте про мобильные устройства

---

## Инструменты для проверки

### 1. Google Search Console
Проверяйте как Google видит ваши страницы:
https://search.google.com/search-console

### 2. Facebook Sharing Debugger
Проверяйте превью для Facebook/Instagram:
https://developers.facebook.com/tools/debug/

### 3. Twitter Card Validator
Проверяйте превью для Twitter:
https://cards-dev.twitter.com/validator

### 4. LinkedIn Post Inspector
Проверяйте превью для LinkedIn:
https://www.linkedin.com/post-inspector/

---

## Дополнительные возможности

### Динамические мета-теги
Если нужно менять мета-теги в зависимости от данных:

```tsx
const ProductPage = () => {
    const product = { name: 'iPhone 15', price: '999$' };

    return (
        <div>
            <Helmet>
                <title>{product.name} за {product.price} - Мой магазин</title>
                <meta name="description" content={`Купить ${product.name} по цене ${product.price}`} />
            </Helmet>
            {/* ... */}
        </div>
    );
};
```

### Добавление изображений для соцсетей
```tsx
<Helmet>
    <meta property="og:image" content="https://yoursite.com/images/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:image" content="https://yoursite.com/images/twitter-image.jpg" />
</Helmet>
```

**Рекомендации для изображений:**
- Open Graph: 1200x630 px
- Twitter Card: 1200x600 px
- Формат: JPG или PNG
- Размер файла: менее 1 MB

---

## Частые вопросы (FAQ)

### Q: Нужно ли добавлять Helmet на все страницы?
**A:** Желательно добавить на все публичные страницы (landing, pricing, blog). На приватные страницы (dashboard, settings) можно не добавлять.

### Q: Можно ли использовать одинаковые title/description?
**A:** Нет! Каждая страница должна иметь уникальные мета-теги, иначе Google может понизить ранжирование.

### Q: Как быстро Google увидит изменения?
**A:** Обычно 1-7 дней после деплоя. Можно ускорить через Google Search Console (Request Indexing).

### Q: Что важнее - title или description?
**A:** `<title>` важнее для SEO. `description` важнее для CTR (кликабельности).

### Q: Нужно ли обновлять мета-теги для страниц магазинов (/u/:username)?
**A:** Если страницы доступны только по прямым ссылкам (не для поисковых систем), то SEO не критично. Но OG-теги стоит добавить для красивого превью в соцсетях.

---

## Контакты и поддержка

Если у вас возникли вопросы по SEO или react-helmet-async:
- Документация react-helmet-async: https://github.com/staylor/react-helmet-async
- SEO гайд от Google: https://developers.google.com/search/docs
- Telegram/Email для вопросов: [укажите ваши контакты]

---

**Последнее обновление:** 2025-11-18
