import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {LogOut, Crown} from 'lucide-react';
import {PlanLimits} from '@/types/dashboard';

interface DashboardHeaderProps {
    userName: string;
    userAvatar: string;
    currentPlan: PlanLimits;
    onLogout: () => void;
    showCrown: boolean;
}

export const DashboardHeader = ({userName, userAvatar, currentPlan, onLogout, showCrown}: DashboardHeaderProps) => {
    return (
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">
                    Панель управління
                </h1>
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={userAvatar} alt={userName}/>
                        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-right">
                        <div className="font-medium text-white">{userName}</div>
                        <div className="text-sm text-gray-400 flex items-center">
                            {showCrown && <Crown className="w-3 h-3 mr-1"/>}
                            {currentPlan.name}
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={onLogout}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <LogOut className="w-4 h-4 mr-2"/>
                        Вийти
                    </Button>
                </div>
            </div>
        </header>
    );
};
