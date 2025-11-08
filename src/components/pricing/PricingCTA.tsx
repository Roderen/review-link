import {Button} from '@/components/ui/button';

interface PricingCTAProps {
    onLogin: () => void;
    isLoading: boolean;
}

export const PricingCTA = ({onLogin, isLoading}: PricingCTAProps) => {
    return (
        <section className="py-16 px-4 bg-gray-800">
            <div className="container mx-auto text-center max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 text-white">
                    Готовы начать?
                </h2>
                <p className="text-gray-400 mb-8">
                    Создайте аккаунт за 30 секунд и начните собирать отзывы уже сегодня
                </p>
                <Button
                    size="lg"
                    onClick={onLogin}
                    disabled={isLoading}
                    className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100"
                >
                    {isLoading ? 'Входим...' : 'Начать бесплатно'}
                </Button>
            </div>
        </section>
    );
};
