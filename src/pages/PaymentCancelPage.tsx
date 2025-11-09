import {useNavigate} from 'react-router-dom';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {X} from 'lucide-react';

const PaymentCancelPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-yellow-400"/>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">Оплата отменена</h2>
                    <p className="text-gray-400 mb-6">
                        Вы отменили процесс оплаты. Ваш тарифный план не был изменен.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Если у вас возникли проблемы с оплатой, пожалуйста, свяжитесь с нашей службой поддержки.
                    </p>
                    <div className="flex flex-col space-y-3">
                        <Button
                            onClick={() => navigate('/pricing')}
                            className="w-full bg-gray-700 hover:bg-gray-600"
                        >
                            Попробовать снова
                        </Button>
                        <Button
                            onClick={() => navigate('/dashboard')}
                            variant="outline"
                            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            Вернуться в панель управления
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentCancelPage;
