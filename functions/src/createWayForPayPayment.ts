import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

interface PlanConfig {
    name: string;
    monthlyPrice: number;
    currency: string;
}

const PLANS: Record<string, PlanConfig> = {
    'free': { name: 'Бесплатный', monthlyPrice: 0, currency: 'UAH' },
    'pro': { name: 'Про', monthlyPrice: 620, currency: 'UAH' }, // Поменяли цены: PRO дороже
    'business': { name: 'Бизнес', monthlyPrice: 330, currency: 'UAH' } // BUSINESS дешевле
};

// Функция расчета цены с учетом периода
function calculatePrice(monthlyPrice: number, billingPeriod: 'monthly' | 'yearly'): number {
    if (billingPeriod === 'yearly') {
        return monthlyPrice * 12 * 0.8; // 20% скидка на годовой план
    }
    return monthlyPrice;
}

// Генерация подписи WayForPay
function generateSignature(merchantSecretKey: string, ...params: string[]): string {
    const signString = params.join(';');
    return crypto
        .createHmac('md5', merchantSecretKey)
        .update(signString)
        .digest('hex');
}

export const createWayForPayPayment = functions.https.onCall(async (data, context) => {
    // Проверяем авторизацию
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated'
        );
    }

    const userId = context.auth.uid;
    const { plan, billingPeriod = 'monthly' } = data;

    // Проверяем наличие плана
    if (!plan || !PLANS[plan]) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Invalid plan selected'
        );
    }

    // Проверяем валидность билинг периода
    if (billingPeriod !== 'monthly' && billingPeriod !== 'yearly') {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Invalid billing period'
        );
    }

    const planConfig = PLANS[plan];

    // Бесплатный план не требует оплаты
    if (planConfig.monthlyPrice === 0) {
        // Обновляем план пользователя сразу
        await admin.firestore().collection('users').doc(userId).update({
            plan: 'free',
            subscriptionStatus: 'active'
        });

        return {
            success: true,
            message: 'Free plan activated'
        };
    }

    // Получаем конфигурацию WayForPay из переменных окружения
    const merchantAccount = functions.config().wayforpay?.merchant_account;
    const merchantSecretKey = functions.config().wayforpay?.secret_key;
    const merchantDomainName = functions.config().wayforpay?.domain_name;

    if (!merchantAccount || !merchantSecretKey || !merchantDomainName) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'WayForPay configuration is missing'
        );
    }

    // Рассчитываем цену с учетом периода
    const finalPrice = calculatePrice(planConfig.monthlyPrice, billingPeriod);

    // Генерируем уникальный ID заказа
    const orderReference = `order_${userId}_${Date.now()}`;
    const orderDate = Math.floor(Date.now() / 1000).toString(); // Unix timestamp
    const amount = Math.round(finalPrice).toString();
    const currency = planConfig.currency;
    const periodText = billingPeriod === 'yearly' ? 'Годовая подписка' : 'Месячная подписка';
    const productName = `ReviewLink ${planConfig.name} - ${periodText}`;
    const productCount = '1';
    const productPrice = amount;

    // Получаем данные пользователя
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Генерируем подпись
    const signature = generateSignature(
        merchantSecretKey,
        merchantAccount,
        merchantDomainName,
        orderReference,
        orderDate,
        amount,
        currency,
        productName,
        productCount,
        productPrice
    );

    // Сохраняем информацию о платеже
    await admin.firestore().collection('payments').doc(orderReference).set({
        userId,
        plan,
        billingPeriod,
        amount: finalPrice,
        currency,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        orderReference
    });

    // Возвращаем данные для формы WayForPay
    return {
        merchantAccount,
        merchantDomainName,
        orderReference,
        orderDate,
        amount,
        currency,
        productName: [productName],
        productCount: [productCount],
        productPrice: [productPrice],
        merchantSignature: signature,
        returnUrl: `${merchantDomainName}/payment/success`,
        serviceUrl: `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/wayforpayWebhook`,
        clientEmail: userData?.email || '',
        clientFirstName: userData?.name?.split(' ')[0] || 'User',
        clientLastName: userData?.name?.split(' ')[1] || '',
        defaultPaymentSystem: 'card'
    };
});
