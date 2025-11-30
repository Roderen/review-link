import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

// Создаем Express приложение
const app = express();

// Добавляем middleware для парсинга form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Генерация подписи для проверки
function generateSignature(merchantSecretKey: string, ...params: string[]): string {
    const signString = params.join(';');
    return crypto
        .createHmac('md5', merchantSecretKey)
        .update(signString)
        .digest('hex');
}

app.post('/', async (req: Request, res: Response) => {
    try {
        // Логируем весь запрос для отладки
        console.log('=== WEBHOOK DEBUG START ===');
        console.log('Method:', req.method);
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body:', JSON.stringify(req.body, null, 2));
        console.log('Query:', JSON.stringify(req.query, null, 2));
        console.log('Content-Type:', req.get('content-type'));
        console.log('Raw Body type:', typeof req.body);
        console.log('=== WEBHOOK DEBUG END ===');

        const merchantSecretKey = functions.config().wayforpay?.secret_key;

        if (!merchantSecretKey) {
            console.error('WayForPay secret key is not configured');
            res.status(500).send('Configuration error');
            return;
        }

        // WayForPay отправляет данные в странном формате:
        // весь JSON как ключ объекта с пустым значением
        let parsedData;
        try {
            const keys = Object.keys(req.body);
            if (keys.length === 0) {
                console.error('Empty request body');
                res.status(400).send('Empty request body');
                return;
            }

            // Берем первый ключ - это и есть JSON-строка с данными
            const jsonKey = keys[0];
            console.log('Parsing JSON key:', jsonKey);
            parsedData = JSON.parse(jsonKey);
            console.log('Parsed data:', JSON.stringify(parsedData, null, 2));
        } catch (error) {
            console.error('Failed to parse WayForPay data:', error);
            res.status(400).send('Invalid request format');
            return;
        }

        const {
            merchantAccount,
            orderReference,
            amount,
            currency,
            authCode,
            cardPan,
            transactionStatus,
            reasonCode,
            merchantSignature
        } = parsedData;

        console.log('WayForPay webhook received:', {
            orderReference,
            transactionStatus,
            amount
        });

        // Проверяем подпись
        const expectedSignature = generateSignature(
            merchantSecretKey,
            merchantAccount,
            orderReference,
            amount,
            currency,
            authCode,
            cardPan,
            transactionStatus,
            reasonCode
        );

        if (merchantSignature !== expectedSignature) {
            console.error('Invalid signature', {
                received: merchantSignature,
                expected: expectedSignature
            });
            res.status(400).send('Invalid signature');
            return;
        }

        // Получаем информацию о платеже
        const paymentDoc = await admin.firestore()
            .collection('payments')
            .doc(orderReference)
            .get();

        if (!paymentDoc.exists) {
            console.error('Payment not found:', orderReference);
            res.status(404).send('Payment not found');
            return;
        }

        const paymentData = paymentDoc.data();
        const userId = paymentData?.userId;
        const plan = paymentData?.plan;
        const billingPeriod = paymentData?.billingPeriod || 'monthly';

        // Обновляем статус платежа
        await admin.firestore()
            .collection('payments')
            .doc(orderReference)
            .update({
                status: transactionStatus === 'Approved' ? 'completed' : 'failed',
                transactionStatus,
                authCode,
                cardPan,
                reasonCode,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

        // Если оплата успешна - обновляем план пользователя
        if (transactionStatus === 'Approved' && userId && plan) {
            const subscriptionEndDate = new Date();

            // Устанавливаем дату окончания в зависимости от периода
            if (billingPeriod === 'yearly') {
                subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1); // +1 год
            } else {
                subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // +1 месяц
            }

            // Определяем лимит отзывов по плану
            const reviewsLimit = plan === 'pro' ? 100 : (plan === 'business' ? 999999 : 10);

            await admin.firestore()
                .collection('users')
                .doc(userId)
                .update({
                    'subscription.plan': plan.toUpperCase(),
                    'subscription.status': 'ACTIVE',
                    'subscription.reviewsLimit': reviewsLimit,
                    'subscription.startDate': admin.firestore.FieldValue.serverTimestamp(),
                    'subscription.endDate': admin.firestore.Timestamp.fromDate(subscriptionEndDate),
                    'subscription.renewalDate': admin.firestore.Timestamp.fromDate(subscriptionEndDate),
                    billingPeriod,
                    lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

            console.log('User plan updated:', { userId, plan, billingPeriod, subscriptionEndDate, reviewsLimit });
        }

        // Отправляем ответ WayForPay в нужном формате
        const responseSignature = generateSignature(
            merchantSecretKey,
            orderReference,
            'accept',
            Math.floor(Date.now() / 1000).toString()
        );

        res.status(200).json({
            orderReference,
            status: 'accept',
            time: Math.floor(Date.now() / 1000),
            signature: responseSignature
        });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal server error');
    }
});

// Экспортируем Express app как Cloud Function
export const wayforpayWebhook = functions.https.onRequest(app);
