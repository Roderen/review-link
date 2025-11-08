import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';

interface PricingPreviewProps {
    onViewAllPlans: () => void;
}

const plans = [
    {name: 'Бесплатный', price: '0₽', reviews: '10 отзывов'},
    {name: 'Стартер', price: '5$', reviews: '100 отзывов'},
    {name: 'Бизнес', price: '12$', reviews: '500 отзывов'},
    {name: 'Про', price: '20$', reviews: 'Безлимит'}
];

export const PricingPreview = ({onViewAllPlans}: PricingPreviewProps) => {
    return (
        <section className="py-16 px-4 bg-gray-900/30">
            <div className="container mx-auto text-center max-w-4xl">
                <h2 className="text-3xl font-bold mb-4 text-white">
                    Начните бесплатно
                </h2>
                <p className="text-gray-400 mb-8">
                    Выберите тариф, который подходит вашему бизнесу
                </p>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {plans.map((plan, index) => (
                        <Card key={index}
                              className="p-4 bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                            <CardContent className="pt-4 text-center">
                                <h3 className="font-semibold text-white mb-2">{plan.name}</h3>
                                <div className="text-2xl font-bold text-white mb-1">{plan.price}</div>
                                <p className="text-sm text-gray-400">{plan.reviews}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button
                    size="lg"
                    onClick={onViewAllPlans}
                    className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100"
                >
                    Посмотреть все тарифы
                </Button>
            </div>
        </section>
    );
};
