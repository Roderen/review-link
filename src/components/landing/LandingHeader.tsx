import {Button} from '@/components/ui/button';
import {MessageSquare} from 'lucide-react';

interface LandingHeaderProps {
    onLogin: () => void;
    onPricingClick: () => void;
    isLoading: boolean;
}

export const LandingHeader = ({onLogin, onPricingClick, isLoading}: LandingHeaderProps) => {
    return (
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div
                        className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white"/>
                    </div>
                    <span className="text-xl font-bold text-white">
                        ReviewInBio
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={onPricingClick}
                        className="text-gray-300 hover:text-white"
                    >
                        Тарифи
                    </Button>
                    <Button onClick={onLogin} disabled={isLoading}
                            className="bg-white text-gray-900 hover:bg-gray-100">
                        {isLoading ? 'Входимо...' : 'Увійти'}
                    </Button>
                </div>
            </div>
        </header>
    );
};
