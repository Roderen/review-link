import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Scheduled function для проверки истекших подписок
 * Запускается каждый день в 00:00 UTC
 */
export const checkExpiredSubscriptions = functions.pubsub
    .schedule('0 0 * * *') // Каждый день в полночь
    .timeZone('UTC')
    .onRun(async (context) => {
        const now = admin.firestore.Timestamp.now();

        try {
            console.log('Starting subscription expiration check...');

            // Находим всех пользователей с активными платными подписками
            const usersSnapshot = await admin.firestore()
                .collection('users')
                .where('subscription.status', '==', 'ACTIVE')
                .where('subscription.plan', 'in', ['PRO', 'BUSINESS'])
                .get();

            let expiredCount = 0;
            const batch = admin.firestore().batch();

            for (const doc of usersSnapshot.docs) {
                const userData = doc.data();
                const subscriptionEndDate = userData.subscription?.endDate;

                // Проверяем истекла ли подписка
                if (subscriptionEndDate && subscriptionEndDate.toMillis() < now.toMillis()) {
                    console.log(`Subscription expired for user: ${doc.id}`);

                    // Обновляем пользователя: возвращаем на FREE план
                    batch.update(doc.ref, {
                        'subscription.plan': 'FREE',
                        'subscription.status': 'EXPIRED',
                        'subscription.reviewsLimit': 10,
                        billingPeriod: null,
                        previousPlan: userData.subscription?.plan, // Сохраняем предыдущий план
                        expiredAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    expiredCount++;
                }
            }

            // Применяем все изменения
            if (expiredCount > 0) {
                await batch.commit();
                console.log(`Successfully expired ${expiredCount} subscription(s)`);
            } else {
                console.log('No expired subscriptions found');
            }

            return {
                success: true,
                expiredCount
            };

        } catch (error) {
            console.error('Error checking expired subscriptions:', error);
            throw error;
        }
    });
