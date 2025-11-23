import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

// Генерация подписи для проверки
function generateSignature(merchantSecretKey: string, ...params: string[]): string {
    const signString = params.join(';');
    return crypto
        .createHmac('md5', merchantSecretKey)
        .update(signString)
        .digest('hex');
}

export const wayforpayWebhook = functions.https.onRequest(async (req, res) => {
    try {
        // WayForPay отправляет POST запрос
        if (req.method !== 'POST') {
            res.status(405).send('Method not allowed');
            return;
        }

        const merchantSecretKey = functions.config().wayforpay?.secret_key;

        if (!merchantSecretKey) {
            console.error('WayForPay secret key is not configured');
            res.status(500).send('Configuration error');
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
        } = req.body;

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

            await admin.firestore()
                .collection('users')
                .doc(userId)
                .update({
                    plan,
                    billingPeriod,
                    subscriptionStatus: 'active',
                    subscriptionStartDate: admin.firestore.FieldValue.serverTimestamp(),
                    subscriptionEndDate: admin.firestore.Timestamp.fromDate(subscriptionEndDate),
                    lastPaymentDate: admin.firestore.FieldValue.serverTimestamp()
                });

            console.log('User plan updated:', { userId, plan, billingPeriod, subscriptionEndDate });
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
