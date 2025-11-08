import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {signInWithGoogle} from '@/lib/firebase/auth.ts';
import {PricingHeader} from '@/components/pricing/PricingHeader';
import {PricingHero} from '@/components/pricing/PricingHero';
import {PricingCard} from '@/components/pricing/PricingCard';
import {FAQSection} from '@/components/pricing/FAQSection';
import {PricingCTA} from '@/components/pricing/PricingCTA';
import {LandingFooter} from '@/components/landing/LandingFooter';
import {PlanFeature} from '@/types/pricing';

const PricingPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            // AuthContext will handle navigation after successful login
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const plans: PlanFeature[] = [
        {
            name: 'Бесплатный',
            price: '0₽',
            period: 'навсегда',
            description: 'Для начинающих',
            features: [
                'До 10 отзывов в месяц',
                'Базовая форма отзывов',
                'Публичная страница',
                'Загрузка фото (до 3 на отзыв)',
                'Email поддержка'
            ],
            popular: false,
            buttonText: 'Начать бесплатно',
            buttonVariant: 'outline' as const
        },
        {
            name: 'Стартер',
            price: '5$',
            period: 'в месяц',
            description: 'Для малого бизнеса',
            features: [
                'До 100 отзывов в месяц',
                'Расширенная форма отзывов',
                'Кастомизация страницы',
                'Загрузка фото и видео (до 5 на отзыв)',
                'Базовая аналитика',
                'Приоритетная поддержка'
            ],
            popular: true,
            buttonText: 'Выбрать план',
            buttonVariant: 'default' as const
        },
        {
            name: 'Бизнес',
            price: '12$',
            period: 'в месяц',
            description: 'Для растущего бизнеса',
            features: [
                'До 500 отзывов в месяц',
                'Полная кастомизация',
                'Расширенная аналитика',
                'Экспорт данных',
                'Интеграция с соцсетями',
                'Модерация отзывов',
                'Приоритетная поддержка'
            ],
            popular: false,
            buttonText: 'Выбрать план',
            buttonVariant: 'outline' as const
        },
        {
            name: 'Про',
            price: '20$',
            period: 'в месяц',
            description: 'Для крупного бизнеса',
            features: [
                'Безлимитные отзывы',
                'Белый лейбл',
                'API доступ',
                'Продвинутая аналитика',
                'Мультиязычность',
                'Персональный менеджер',
                'SLA 99.9%'
            ],
            popular: false,
            buttonText: 'Связаться с нами',
            buttonVariant: 'outline' as const
        }
    ];

    return (
        <div className="min-h-screen bg-gray-950">
            <PricingHeader
                onBack={() => navigate('/')}
                onLogin={handleGoogleLogin}
                isLoading={isLoading}
            />

            <PricingHero/>

            {/* Pricing Cards */}
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, index) => (
                            <PricingCard
                                key={index}
                                plan={plan}
                                onSelect={handleGoogleLogin}
                                isLoading={isLoading}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <FAQSection/>

            <PricingCTA onLogin={handleGoogleLogin} isLoading={isLoading}/>

            <LandingFooter/>
        </div>
    );
};

export default PricingPage;
