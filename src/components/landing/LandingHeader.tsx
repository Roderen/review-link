import {Button} from '@/components/ui/button';
import logo from '@/images/logo.png';

interface LandingHeaderProps {
    onLogin: () => void;
    onPricingClick: () => void;
    isLoading: boolean;
}

export const LandingHeader = ({onLogin, isLoading}: LandingHeaderProps) => {
    return (
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div
                        className="w-8 h-8 flex items-center justify-center">
                        <img src={logo as string} alt="Logo"/>
                    </div>
                    <span className="text-xl font-bold text-white">
                        ReviewInBio
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <Button onClick={onLogin} disabled={isLoading}
                            className="bg-white text-gray-900 hover:bg-gray-100">
                        {isLoading ? 'Входимо...' : 'Увійти'}
                    </Button>
                </div>
            </div>
        </header>
    );
};
