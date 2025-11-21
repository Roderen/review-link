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

const PricingPage = () => {
    const navigate = useNavigate();
    const {user, isLoading: authLoading} = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plans: PlanFeature[] = [
        {
            name: 'Бесплатный',
            price: '0$',
            period: 'навсегда',
            features: [
                'До 10 отзывов',
                'Публичная страница отзывов',
                'Статистика отзывов'
            ],
            popular: false,
            buttonText: 'Попробовать бесплатно',
            buttonVariant: 'outline' as const
        },
        {
            name: 'Про',
            price: '7.99$',
            period: '/месяц',
            features: [
                'До 100 отзывов',
                'Загрузка фото (до 3 на отзыв)',
                'Статистика отзывов',
                'Email поддержка'
            ],
            popular: true,
            buttonText: 'Начать сейчас',
            buttonVariant: 'default' as const
        },
        {
            name: 'Бизнес',
            price: '14.99$',
            period: '/месяц',
            features: [
                'Безлимитные отзывы',
                'Загрузка фото и видео (до 5 на отзыв)',
                'Статистика отзывов',
                'Приоритетная поддержка'
            ],
            popular: false,
            buttonText: 'Начать сейчас',
            buttonVariant: 'outline' as const
        }
    ];

    const planIds: Record<string, string> = {
        'Бесплатный': 'free',
        'Про': 'pro',
        'Бизнес': 'business'
    };

    // Обработка выбора плана
    const handleSelectPlan = async (planName: string) => {
        const planId = planIds[planName];

        if (!planId) {
            toast.error('Неверный план');
            return;
        }

        setSelectedPlan(planId);

        try {
            await initiateWayForPayCheckout(planId);
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
                <title>Тарифы и цены - Instagram Reviews</title>
                <meta name="description" content="Выберите подходящий тариф для вашего бизнеса. От бесплатного плана до безлимитных отзывов. Начните собирать отзывы уже сегодня!" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Тарифы и цены - Instagram Reviews" />
                <meta property="og:description" content="Выберите подходящий тариф для вашего бизнеса. От бесплатного плана до безлимитных отзывов. Начните собирать отзывы уже сегодня!" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Тарифы и цены - Instagram Reviews" />
                <meta name="twitter:description" content="Выберите подходящий тариф для вашего бизнеса. От бесплатного плана до безлимитных отзывов. Начните собирать отзывы уже сегодня!" />

                {/* Keywords */}
                <meta name="keywords" content="pricing, тарифы, цены, отзывы, instagram, подписка, бесплатно" />
            </Helmet>

            <PricingHeader
                onBack={() => navigate('/dashboard')}
                showLoginButton={false}
            />

            <PricingHero/>

            {/* Pricing Cards */}
            <section className="py-8 px-4">
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
        </div>
    );
};

export default PricingPage;
