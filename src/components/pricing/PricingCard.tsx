import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Check} from 'lucide-react';
import {PlanFeature} from '@/types/pricing';

interface PricingCardProps {
    plan: PlanFeature;
    onSelect: () => void;
    isLoading: boolean;
}

export const PricingCard = ({plan, onSelect, isLoading}: PricingCardProps) => {
    return (
        <Card
            className={`relative p-6 transition-all hover:scale-105 ${
                plan.popular
                    ? 'bg-gray-800 border-gray-600 shadow-xl'
                    : 'bg-gray-900 border-gray-700 hover:border-gray-600'
            }`}
        >
            {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-900">
                    Популярный
                </Badge>
            )}

            <CardHeader className="text-center pb-4">
                <CardTitle className="text-white text-xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/>
                            <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Button
                    className={`w-full mt-6 ${
                        plan.popular
                            ? 'bg-white text-gray-900 hover:bg-gray-100'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    variant={plan.buttonVariant}
                    onClick={onSelect}
                    disabled={isLoading}
                >
                    {plan.buttonText}
                </Button>
            </CardContent>
        </Card>
    );
};
