import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Check, X} from 'lucide-react';

interface StatusCardProps {
    type: 'success' | 'limit-reached' | 'loading';
    shopName?: string;
    onClose?: () => void;
}

export const StatusCard = ({type, shopName, onClose}: StatusCardProps) => {
    if (type === 'loading') {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white">Загрузка...</div>
            </div>
        );
    }

    if (type === 'limit-reached') {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center bg-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                        <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-red-400"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Лимит отзывов достигнут</h2>
                        <p className="text-gray-400 mb-6">
                            К сожалению, для магазина {shopName || 'данного магазина'} достигнут лимит по количеству отзывов.
                        </p>
                        <Button
                            onClick={onClose}
                            className="w-full bg-gray-700 hover:bg-gray-600"
                        >
                            Закрыть
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // type === 'success'
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                    <div
                        className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-400"/>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">Отзыв отправлен!</h2>
                    <p className="text-gray-400 mb-6">
                        Спасибо за ваш отзыв о магазине {shopName || 'магазина'}.
                        Он поможет другим покупателям сделать правильный выбор.
                    </p>
                    <Button
                        onClick={onClose}
                        className="w-full bg-gray-700 hover:bg-gray-600"
                    >
                        Закрыть
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
