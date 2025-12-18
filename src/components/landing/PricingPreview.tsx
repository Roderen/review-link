import {PricingCard} from '@/components/pricing/PricingCard';
import {PlanFeature} from '@/types/pricing';

interface PricingPreviewProps {
    onLogin: () => void;
    isLoading: boolean;
}

const plans: PlanFeature[] = [
    {
        name: 'Free',
        price: '0$',
        period: 'назавжди',
        features: [
            'До 10 відгуків',
            'Публічна сторінка відгуків',
            'Статистика відгуків'
        ],
        popular: false,
        buttonText: 'Почати безкоштовно',
        buttonVariant: 'outline' as const
    },
    {
        name: 'Pro',
        price: '7.99$',
        period: '/місяць',
        features: [
            'До 100 відгуків',
            'Завантаження фото (до 3 на відгук)',
            'Статистика відгуків',
            'Email-підтримка'
        ],
        popular: false,
        buttonText: 'Почати зараз',
        buttonVariant: 'default' as const
    },
    {
        name: 'Business',
        price: '14.99$',
        period: '/місяць',
        features: [
            'Безлімітні відгуки',
            'Завантаження фото (до 5 на відгук)',
            'Статистика відгуків',
            'Пріоритетна підтримка через месенджери'
        ],
        popular: false,
        buttonText: 'Почати зараз',
        buttonVariant: 'outline' as const
    }
];

export const PricingPreview = ({onLogin, isLoading}: PricingPreviewProps) => {
    return (
        <section id="pricing" className="py-16 px-4 bg-gray-900/30">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-white">
                        Почніть безкоштовно
                    </h2>
                    <p className="text-gray-400">
                        Оберіть тариф, який вам підходить
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={index}
                            plan={plan}
                            onSelect={onLogin}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
