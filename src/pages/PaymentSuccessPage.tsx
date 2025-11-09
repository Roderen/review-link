import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Check} from 'lucide-react';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Автоматический редирект через 5 секунд
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-400"/>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">Оплата прошла успешно!</h2>
                    <p className="text-gray-400 mb-6">
                        Спасибо за оплату! Ваш тарифный план был успешно обновлен.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Вы будете автоматически перенаправлены в панель управления через 5 секунд...
                    </p>
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-gray-700 hover:bg-gray-600"
                    >
                        Перейти в панель управления
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
