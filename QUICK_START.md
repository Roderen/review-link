# ⚡ Quick Start - Команды для ежедневной работы

Краткая шпаргалка для быстрого старта и деплоя проекта Review Link.

---

## 🚀 Первый запуск (одноразово)

```bash
# 1. Клонируйте и установите зависимости
git clone <your-repo>
cd review-link
npm install
cd functions && npm install && cd ..

# 2. Настройте окружение
cp .env.example .env
# Заполните Firebase credentials в .env

# 3. Установите Firebase CLI (если нет)
npm install -g firebase-tools
firebase login

# 4. Запустите эмуляторы (опционально)
firebase emulators:start
```

---

## 💻 Разработка (каждый день)

```bash
# Запустить dev сервер
npm run dev

# Открыть в браузере
http://localhost:5173

# Запустить с Firebase эмуляторами (в отдельном терминале)
firebase emulators:start
```

---

## 📦 Деплой на Production

### Полный деплой (hosting + functions + rules)

```bash
# 1. Соберите проект
npm run build

# 2. Деплой всего
firebase deploy

# 3. Проверьте URL
# https://your-project-id.web.app
```

### Быстрый деплой (только что изменили)

```bash
# Только frontend (если меняли UI)
npm run build && firebase deploy --only hosting

# Только functions (если меняли backend)
./deploy-functions.sh
# или
cd functions && npm run deploy && cd ..

# Только Firestore rules (если меняли security)
firebase deploy --only firestore:rules

# Только Storage rules
firebase deploy --only storage:rules
```

---

## 🔍 Мониторинг и логи

### Логи Cloud Functions

```bash
# Все логи в реальном времени
firebase functions:log

# Логи конкретной функции
firebase functions:log --only createWayForPayPayment

# Последние 100 записей
firebase functions:log --limit 100

# Фильтр по времени (последний час)
firebase functions:log --since 1h
```

### Проверка использования

```bash
# Откройте Firebase Console
firebase open

# Или прямая ссылка на usage:
https://console.firebase.google.com/project/YOUR_PROJECT/usage
```

---

## 🧪 Тестирование

### Локальное тестирование с эмуляторами

```bash
# Терминал 1: Запустите эмуляторы
firebase emulators:start

# Терминал 2: Запустите dev сервер
npm run dev

# UI эмуляторов:
http://localhost:4000

# Эндпоинты:
# - Firestore: http://localhost:8080
# - Auth: http://localhost:9099
# - Functions: http://localhost:5001
# - Storage: http://localhost:9199
```

---

## 🔧 Полезные команды Firebase

### Информация о проекте

```bash
# Список проектов
firebase projects:list

# Текущий проект
firebase use

# Переключить проект
firebase use <project-id>

# Открыть Firebase Console
firebase open
```

### Firestore

```bash
# Экспорт данных
firebase firestore:export gs://YOUR_BUCKET/backup-$(date +%Y%m%d)

# Импорт данных
firebase firestore:import gs://YOUR_BUCKET/backup-20231201

# Деплой индексов
firebase deploy --only firestore:indexes
```

### Functions

```bash
# Список функций
firebase functions:list

# Удалить функцию
firebase functions:delete functionName

# Настроить переменные окружения
firebase functions:config:set wayforpay.merchant_account="YOUR_ACCOUNT"
firebase functions:config:get
```

---

## 🐛 Отладка проблем

### Frontend не собирается

```bash
# Очистите кэш и пересоберите
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Functions не деплоятся

```bash
# Пересоберите functions
cd functions
rm -rf node_modules package-lock.json
npm install
npm run build
cd ..

# Деплой с флагом --force
firebase deploy --only functions --force
```

### Ошибки в production

```bash
# Логи в реальном времени
firebase functions:log

# Проверьте Firestore rules
firebase deploy --only firestore:rules

# Откатите до предыдущей версии (в Firebase Console)
https://console.firebase.google.com/project/YOUR_PROJECT/hosting
```

---

## 📊 Мониторинг лимитов

### Быстрая проверка использования

```bash
# Firebase Console → Usage
firebase open

# Или командой (неофициально):
gcloud app logs read --limit 50
```

### Алерты при приближении к лимитам

1. Firebase Console → Project settings
2. Usage and billing → Set budget alert
3. Установите: 50%, 80%, 100%

---

## 🎯 Автодеплой через GitHub

### Настройка (одноразово)

См. подробную инструкцию: [DEPLOY_SETUP.md](./DEPLOY_SETUP.md)

Кратко:
```bash
# 1. Создайте Firebase Service Account
firebase init hosting:github

# 2. Добавьте секреты в GitHub:
# Settings → Secrets → Actions → New secret
# - FIREBASE_SERVICE_ACCOUNT
# - VITE_FIREBASE_* (все env переменные)

# 3. Push в main:
git add .
git commit -m "Setup auto-deploy"
git push origin main

# Готово! Теперь каждый push = автодеплой
```

---

## 🔐 Переменные окружения

### Локально (.env файл)

```bash
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... остальные
```

### Production (Firebase Config)

```bash
# Для Cloud Functions:
firebase functions:config:set \
  wayforpay.merchant_account="YOUR_ACCOUNT" \
  wayforpay.secret_key="YOUR_SECRET" \
  wayforpay.domain_name="YOUR_DOMAIN"

# Посмотреть:
firebase functions:config:get

# Для frontend (Vite) используйте GitHub Secrets
# См. DEPLOY_SETUP.md
```

---

## 💾 Бэкапы

### Firestore

```bash
# Экспорт в Cloud Storage
firebase firestore:export gs://YOUR_BUCKET/backup-$(date +%Y%m%d)

# Импорт из Cloud Storage
firebase firestore:import gs://YOUR_BUCKET/backup-20231201
```

### Настройка автоматических бэкапов

```bash
# Используйте scheduled functions (в functions/src/):
export const scheduledFirestoreBackup = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    // Код экспорта
  });
```

---

## 🚦 Проверка здоровья проекта

### Чеклист перед деплоем

```bash
# ✅ Линтинг пройден
npm run lint

# ✅ Сборка успешна
npm run build

# ✅ Functions собираются
cd functions && npm run build && cd ..

# ✅ Нет критических ошибок в логах
firebase functions:log --limit 20

# ✅ .env настроен (для локальной разработки)
cat .env | grep VITE_FIREBASE_API_KEY

# Теперь можно деплоить!
firebase deploy
```

---

## 📱 Быстрые ссылки

### Production URLs

```bash
# Ваш сайт
https://your-project-id.web.app

# Firebase Console
https://console.firebase.google.com/project/YOUR_PROJECT

# Hosting dashboard
https://console.firebase.google.com/project/YOUR_PROJECT/hosting

# Functions logs
https://console.firebase.google.com/project/YOUR_PROJECT/functions/logs

# Firestore database
https://console.firebase.google.com/project/YOUR_PROJECT/firestore

# Usage & billing
https://console.firebase.google.com/project/YOUR_PROJECT/usage
```

### Локальные URLs

```bash
# Dev сервер
http://localhost:5173

# Firebase Emulator UI
http://localhost:4000

# Firestore emulator
http://localhost:8080

# Auth emulator
http://localhost:9099

# Functions emulator
http://localhost:5001
```

---

## 🎨 Git workflow

### Обычный день разработки

```bash
# 1. Создайте feature branch
git checkout -b feature/my-new-feature

# 2. Работайте над фичей
# ... code code code ...

# 3. Commit изменения
git add .
git commit -m "feat: Add new feature"

# 4. Push в branch
git push origin feature/my-new-feature

# 5. Создайте PR на GitHub

# 6. После мержа в main - автоматический деплой!
```

### Быстрый hotfix

```bash
# 1. Создайте hotfix branch
git checkout -b hotfix/critical-bug

# 2. Исправьте баг
# ... fix fix fix ...

# 3. Commit и push
git add .
git commit -m "fix: Critical bug in payment"
git push origin hotfix/critical-bug

# 4. Мерж в main → автодеплой
```

---

## 🛠️ Устранение частых проблем

### "Permission denied" при деплое

```bash
# Перелогиньтесь в Firebase
firebase logout
firebase login
```

### "Build failed" в GitHub Actions

```bash
# Проверьте секреты в GitHub:
# Settings → Secrets → Actions
# Убедитесь что все VITE_* переменные добавлены
```

### "Cold start" у Cloud Functions

```bash
# Это нормально для бесплатного плана
# Решение: перейти на Blaze Plan (платный)
# Или использовать Cloud Scheduler для keep-alive
```

### Firestore Rules блокируют запросы

```bash
# Проверьте rules:
cat firestore.rules

# Деплой rules:
firebase deploy --only firestore:rules

# Тестируйте в Emulator UI:
http://localhost:4000/firestore
```

---

## 📚 Документация

- [README.md](./README.md) - Общее описание проекта
- [DEPLOY_SETUP.md](./DEPLOY_SETUP.md) - Настройка автодеплоя
- [REMOVE_PAYMENTS.md](./REMOVE_PAYMENTS.md) - Убрать платежи для MVP
- [HOSTING_COMPARISON.md](./HOSTING_COMPARISON.md) - Сравнение хостингов
- [WAYFORPAY_SETUP.md](./WAYFORPAY_SETUP.md) - Настройка платежей
- [SEO.md](./SEO.md) - SEO оптимизация

---

## ⚡ TL;DR - Самое важное

```bash
# Разработка
npm run dev

# Деплой
npm run build && firebase deploy

# Логи
firebase functions:log

# Мониторинг
firebase open  # → Usage and billing

# Автодеплой
git push origin main  # → GitHub Actions сделает все сам
```

**Удачи! 🚀**
