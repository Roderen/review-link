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
                    Почніть збирати відгуки вже сьогодні
                </h2>
                <p className="text-gray-400 mb-8">
                    Приєднуйтесь до інших магазинів, які вже користуються ReviewInBio
                </p>
                <Button
                    size="lg"
                    onClick={onLogin}
                    disabled={isLoading}
                    className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform"
                >
                    {isLoading ? 'Входимо...' : 'Приєднатись'}
                </Button>
            </div>
        </section>
    );
};
