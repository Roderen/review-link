import {useState} from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext.tsx';
import { Helmet } from 'react-helmet-async';
import {PricingHeader} from '@/components/pricing/PricingHeader';
import {PricingHero} from '@/components/pricing/PricingHero';
import {PricingCard} from '@/components/pricing/PricingCard';
import {FAQSection} from '@/components/pricing/FAQSection';
import {LandingFooter} from '@/components/landing/LandingFooter';
import {PlanFeature} from '@/types/pricing';
import {initiateWayForPayCheckout} from '@/lib/wayforpay/checkout';
import {toast} from 'sonner';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/components/ui/dialog';

// Контакты для поддержки
const SUPPORT_CONTACTS = {
    whatsapp: '+380000000000', // TODO: Замените на реальный номер
    telegram: 'yourusername'    // TODO: Замените на ваш Telegram username
};

const PricingPage = () => {
    const navigate = useNavigate();
    const {user, isLoading: authLoading} = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [showContactModal, setShowContactModal] = useState(false);

    // Базовые цены за месяц
    const basePrices = {
        pro: 7.99,
        business: 14.99
    };

    // Расчет цены с учетом периода
    const calculatePrice = (basePrice: number) => {
        if (billingPeriod === 'yearly') {
            const yearlyPrice = basePrice * 12 * 0.8; // 20% скидка
            return yearlyPrice.toFixed(2);
        }
        return basePrice.toFixed(2);
    };

    // Проверяем текущий план пользователя
    const currentPlan = user?.plan ? (user.plan as string).toUpperCase() : 'FREE';
    const isPaidPlan = currentPlan === 'PRO' || currentPlan === 'BUSINESS';

    const plans: PlanFeature[] = [
        {
            name: 'Free',
            price: '0$',
            period: '',
            features: [
                'До 10 відгуків',
                'Публічна сторінка відгуків',
                'Статистика відгуків'
            ],
            popular: false,
            buttonText: isPaidPlan ? 'Связаться с нами' : 'Спробувати безкоштовно',
            buttonVariant: 'outline' as const
        },
        {
            name: 'Pro',
            price: `${calculatePrice(basePrices.pro)}$`,
            period: billingPeriod === 'monthly' ? '/місяць' : '/рік',
            features: [
                'До 100 відгуків',
                'Завантаження фото (до 3 на відгук)',
                'Статистика відгуків',
                'E-mail Підтримка'
            ],
            popular: false,
            buttonText: 'Почати зараз',
            buttonVariant: 'default' as const,
            savings: billingPeriod === 'yearly' ? '20% економія' : undefined
        },
        {
            name: 'Business',
            price: `${calculatePrice(basePrices.business)}$`,
            period: billingPeriod === 'monthly' ? '/місяць' : '/рік',
            features: [
                'Безлімітні відгуки',
                'Завантаження фото та відео (до 5 на відгук)',
                'Статистика отзывов',
                'Пріоритетна підтримка'
            ],
            popular: false,
            buttonText: 'Почати зараз',
            buttonVariant: 'outline' as const,
            savings: billingPeriod === 'yearly' ? '20% економія' : undefined
        }
    ];

    const planIds: Record<string, string> = {
        'Free': 'free',
        'Pro': 'pro',
        'Business': 'business'
    };

    // Функция открытия мессенджера
    const openMessenger = (messenger: 'whatsapp' | 'telegram') => {
        const currentPlan = user?.plan ? (user.plan as string).toUpperCase() : 'FREE';
        const message = `Доброго дня! Я хочу перейти на безкоштовний тариф з тарифу ${currentPlan}.`;

        if (messenger === 'whatsapp') {
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${SUPPORT_CONTACTS.whatsapp.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        } else if (messenger === 'telegram') {
            const encodedMessage = encodeURIComponent(message);
            const telegramUrl = `https://t.me/${SUPPORT_CONTACTS.telegram}?text=${encodedMessage}`;
            window.open(telegramUrl, '_blank');
        }

        setShowContactModal(false);
    };

    // Обработка выбора плана
    const handleSelectPlan = async (planName: string) => {
        const planId = planIds[planName];

        if (!planId) {
            toast.error('Невірний план');
            return;
        }

        // Проверяем попытку даунгрейда с платного на бесплатный
        if (user && user.plan) {
            const currentPlan = (user.plan as string).toUpperCase();
            const isPaidPlan = currentPlan === 'PRO' || currentPlan === 'BUSINESS';
            const isDowngradeToFree = planId === 'free' && isPaidPlan;

            if (isDowngradeToFree) {
                // Показываем модальное окно с выбором мессенджера
                setShowContactModal(true);
                return;
            }
        }

        setSelectedPlan(planId);

        try {
            await initiateWayForPayCheckout(planId, billingPeriod);
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Ошибка при создании платежа. Попробуйте еще раз.');
            setSelectedPlan(null);
        }
    };

    // Показываем загрузку пока проверяется аутентификация
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white">Загрузка...</div>
            </div>
        );
    }

    // Редирект на главную страницу если пользователь не авторизован
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>Тарифи та ціни</title>
                <meta name="description" content="Виберіть відповідний тариф для вашого бізнесу. Від безкоштовного плану до безлімітних відгуків. Почніть збирати відгуки вже сьогодні!" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Тарифи та ціни" />
                <meta property="og:description" content="Виберіть відповідний тариф для вашого бізнесу. Від безкоштовного плану до безлімітних відгуків. Почніть збирати відгуки вже сьогодні!" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Тарифи та ціни" />
                <meta name="twitter:description" content="Виберіть відповідний тариф для вашого бізнесу. Від безкоштовного плану до безлімітних відгуків. Почніть збирати відгуки вже сьогодні!" />
            </Helmet>

            <PricingHeader
                onBack={() => navigate('/dashboard')}
                showLoginButton={false}
            />

            <PricingHero/>

            {/* Billing Period Toggle */}
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setBillingPeriod('monthly')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                    billingPeriod === 'monthly'
                                        ? 'bg-white text-gray-900'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                На місяць
                            </button>
                            <button
                                onClick={() => setBillingPeriod('yearly')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                                    billingPeriod === 'yearly'
                                        ? 'bg-white text-gray-900'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                На рік
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    -20%
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="px-4 pb-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan, index) => (
                            <PricingCard
                                key={index}
                                plan={plan}
                                onSelect={() => handleSelectPlan(plan.name)}
                                isLoading={selectedPlan === planIds[plan.name]}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <FAQSection/>

            <LandingFooter/>

            {/* Модальное окно выбора мессенджера */}
            <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
                <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl">Связаться с нами</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Выберите удобный способ связи для перехода на бесплатный тариф
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        {/* WhatsApp */}
                        <button
                            onClick={() => openMessenger('whatsapp')}
                            className="flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-white font-semibold text-lg">WhatsApp</h3>
                                <p className="text-gray-400 text-sm">Написать в WhatsApp</p>
                            </div>
                        </button>

                        {/* Telegram */}
                        <button
                            onClick={() => openMessenger('telegram')}
                            className="flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
                        >
                            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-white font-semibold text-lg">Telegram</h3>
                                <p className="text-gray-400 text-sm">Написать в Telegram</p>
                            </div>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PricingPage;
