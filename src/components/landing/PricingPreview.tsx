import {PricingCard} from '@/components/pricing/PricingCard';
import {PlanFeature} from '@/types/pricing';

interface PricingPreviewProps {
    onViewAllPlans: () => void;
}

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
        name: 'Бизнес',
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
        name: 'Про',
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

export const PricingPreview = ({onViewAllPlans}: PricingPreviewProps) => {
    return (
        <section className="py-16 px-4 bg-gray-900/30">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-white">
                        Начните бесплатно
                    </h2>
                    <p className="text-gray-400">
                        Выберите тариф, который подходит вашему бизнесу
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={index}
                            plan={plan}
                            onSelect={onViewAllPlans}
                            isLoading={false}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
