import {Card} from '@/components/ui/card';
import {Star, Image, Video} from 'lucide-react';

interface FeaturePreviewCardProps {
    type: 'review-form' | 'public-page';
}

export const FeaturePreviewCard = ({type}: FeaturePreviewCardProps) => {
    if (type === 'review-form') {
        return (
            <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Форма отзыва</h3>
                <p className="text-gray-400 mb-6">
                    Ваши клиенты легко оставляют отзывы с фото и видео
                </p>
                <Card className="p-6 bg-gray-800 border-gray-700 shadow-lg">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                            <div>
                                <div className="font-medium text-white">Мария Петрова</div>
                                <div className="text-sm text-gray-400">Покупатель</div>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>
                            ))}
                        </div>
                        <p className="text-gray-300">
                            Отличное качество! Платье пришло точно как на фото...
                        </p>
                        <div className="flex space-x-2">
                            <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                                <Image className="w-6 h-6 text-gray-400"/>
                            </div>
                            <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                                <Video className="w-6 h-6 text-gray-400"/>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4 text-white">Публичная страница</h3>
            <p className="text-gray-400 mb-6">
                Красивая витрина всех ваших отзывов для демонстрации клиентам
            </p>
            <Card className="p-6 bg-gray-800 border-gray-700 shadow-lg">
                <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-white">Anna Boutique</h4>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
                            ))}
                        </div>
                        <span className="text-sm text-gray-400">(24 отзыва)</span>
                    </div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((review) => (
                        <div key={review} className="border-l-4 border-gray-600 pl-4 py-2">
                            <div className="flex items-center space-x-2 mb-1">
                                <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                                <span className="text-sm font-medium text-white">Покупатель {review}</span>
                            </div>
                            <div className="flex space-x-1 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star}
                                          className="w-3 h-3 fill-yellow-400 text-yellow-400"/>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400">Отличный товар, рекомендую!</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
