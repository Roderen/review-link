import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PendingApprovalPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Если пользователь не авторизован или его статус уже активен, перенаправляем
        if (!user) {
            navigate('/');
        } else if (user.accountStatus === 'active') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full bg-gray-900 border-gray-800 p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <Clock className="w-12 h-12 text-yellow-500" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white">
                            Спасибо за регистрацию!
                        </h1>
                    </div>

                    {/* Message */}
                    <div className="space-y-4 text-gray-300 max-w-md">
                        <p className="text-base">
                            Ваш аккаунт находится на рассмотрении. <br></br> Мы проверим вашу заявку <span className="font-semibold text-white"> в течение 48 часов</span>.
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="w-full pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                {user.avatar && (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}
                                <div className="text-left">
                                    <p className="text-white font-medium">{user.name}</p>
                                    <p className="text-gray-400 text-xs">{user.email}</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Выйти
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PendingApprovalPage;
