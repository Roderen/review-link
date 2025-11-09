import {Button} from '@/components/ui/button';
import {ArrowLeft} from 'lucide-react';

interface PricingHeaderProps {
    onBack: () => void;
    onLogin?: () => void;
    isLoading?: boolean;
    showLoginButton?: boolean;
}

export const PricingHeader = ({onBack, onLogin, isLoading = false, showLoginButton = true}: PricingHeaderProps) => {
    return (
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-gray-300 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        Назад
                    </Button>
                </div>
                {showLoginButton && onLogin && (
                    <Button onClick={onLogin} disabled={isLoading} className="bg-white text-gray-900 hover:bg-gray-100">
                        {isLoading ? 'Входим...' : 'Войти'}
                    </Button>
                )}
            </div>
        </header>
    );
};
