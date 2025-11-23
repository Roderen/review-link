import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Check, X, AlertCircle} from 'lucide-react';

interface StatusCardProps {
    type: 'success' | 'limit-reached' | 'already-submitted' | 'loading';
    shopName?: string;
    onClose?: () => void;
}

export const StatusCard = ({type, shopName, onClose}: StatusCardProps) => {
    if (type === 'loading') {
        return (
            <div className="min-h-screen bg-gray-950 p-4">
                <div className="max-w-2xl mx-auto animate-pulse">
                    {/* Shop Info Skeleton */}
                    <Card className="bg-gray-900 border-gray-700 mb-6">
                        <CardContent className="pt-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gray-800 rounded-full" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-gray-800 rounded w-1/3" />
                                    <div className="h-4 bg-gray-800 rounded w-2/3" />
                                    <div className="flex space-x-6 mt-4">
                                        <div className="h-4 bg-gray-800 rounded w-20" />
                                        <div className="h-4 bg-gray-800 rounded w-20" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review Form Skeleton */}
                    <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="pt-6 space-y-6">
                            {/* Rating Skeleton */}
                            <div className="space-y-2">
                                <div className="h-5 bg-gray-800 rounded w-24" />
                                <div className="flex space-x-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-10 h-10 bg-gray-800 rounded" />
                                    ))}
                                </div>
                            </div>

                            {/* Name Input Skeleton */}
                            <div className="space-y-2">
                                <div className="h-5 bg-gray-800 rounded w-32" />
                                <div className="h-10 bg-gray-800 rounded w-full" />
                            </div>

                            {/* Review Text Skeleton */}
                            <div className="space-y-2">
                                <div className="h-5 bg-gray-800 rounded w-40" />
                                <div className="h-32 bg-gray-800 rounded w-full" />
                            </div>

                            {/* Media Upload Skeleton */}
                            <div className="space-y-2">
                                <div className="h-5 bg-gray-800 rounded w-36" />
                                <div className="h-28 bg-gray-800 rounded w-full" />
                            </div>

                            {/* Submit Button Skeleton */}
                            <div className="h-10 bg-gray-800 rounded w-full" />
                        </CardContent>
                    </Card>
                </div>
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

    if (type === 'already-submitted') {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center bg-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                        <div className="w-16 h-16 bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-yellow-400"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Отзыв уже отправлен</h2>
                        <p className="text-gray-400 mb-6">
                            Вы уже оставили отзыв о магазине {shopName || 'данном магазине'}.
                            Для предотвращения спама можно оставить только один отзыв с одного устройства.
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
