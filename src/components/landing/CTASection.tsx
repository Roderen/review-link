import {Button} from '@/components/ui/button';

interface CTASectionProps {
    onLogin: () => void;
    isLoading: boolean;
}

export const CTASection = ({onLogin, isLoading}: CTASectionProps) => {
    return (
        <section className="py-16 px-4 bg-gray-800">
            <div className="container mx-auto text-center max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 text-white">
                    Начните собирать отзывы уже сегодня
                </h2>
                <p className="text-gray-400 mb-8">
                    Присоединяйтесь к сотням магазинов, которые уже используют ReviewLink
                </p>
                <Button
                    size="lg"
                    onClick={onLogin}
                    disabled={isLoading}
                    className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform"
                >
                    {isLoading ? 'Входим...' : 'Создать аккаунт бесплатно'}
                </Button>
            </div>
        </section>
    );
};
