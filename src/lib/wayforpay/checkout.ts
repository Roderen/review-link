import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase/config/firebase-config';

interface WayForPayFormData {
    merchantAccount: string;
    merchantDomainName: string;
    orderReference: string;
    orderDate: string;
    amount: string;
    currency: string;
    productName: string[];
    productCount: string[];
    productPrice: string[];
    merchantSignature: string;
    returnUrl: string;
    serviceUrl: string;
    clientEmail?: string;
    clientFirstName?: string;
    clientLastName?: string;
    defaultPaymentSystem?: string;
}

/**
 * Создает платеж WayForPay и редиректит на страницу оплаты
 * @param planId - ID выбранного плана (free, starter, business, pro)
 */
export async function initiateWayForPayCheckout(planId: string): Promise<void> {
    try {
        // Вызываем Cloud Function для создания платежа
        const createPayment = httpsCallable(functions, 'createWayForPayPayment');
        const result = await createPayment({ plan: planId });

        const paymentData = result.data as any;

        // Если бесплатный план - просто показываем сообщение
        if (paymentData.success && paymentData.message === 'Free plan activated') {
            alert('Бесплатный план активирован!');
            window.location.href = '/dashboard';
            return;
        }

        // Создаем форму для отправки на WayForPay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://secure.wayforpay.com/pay';
        form.style.display = 'none';

        // Добавляем все поля формы
        const formData: WayForPayFormData = paymentData as WayForPayFormData;

        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Для массивов создаем несколько полей
                value.forEach((item) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = `${key}[]`;
                    input.value = item;
                    form.appendChild(input);
                });
            } else {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
            }
        });

        // Добавляем форму в документ и отправляем
        document.body.appendChild(form);
        form.submit();

    } catch (error) {
        console.error('Error initiating WayForPay checkout:', error);
        throw error;
    }
}

/**
 * Отменить подписку (для будущей реализации)
 */
export async function cancelSubscription(): Promise<void> {
    // TODO: Реализовать отмену подписки через WayForPay API
    console.log('Cancel subscription - to be implemented');
}
