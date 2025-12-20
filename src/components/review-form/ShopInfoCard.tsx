import {Card, CardContent} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Star} from 'lucide-react';
import {ShopStats} from '@/types/review-form';

interface ShopInfoCardProps {
    avatar: string;
    name: string;
    description?: string;
    shopStats: ShopStats | null;
}

export const ShopInfoCard = ({avatar, name, description, shopStats}: ShopInfoCardProps) => {
    return (
        <Card className="mb-6 bg-gray-900 border-gray-700">
            <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={avatar} alt={name}/>
                        <AvatarFallback>{name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{name || 'Магазин'}</h1>
                        <p className="text-gray-400">{description || 'Опис відсутній'}</p>
                        {shopStats && (
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= Math.floor(shopStats.averageRating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-400">
                                    {shopStats.averageRating.toFixed(1)} ({shopStats.totalCount} {shopStats.totalCount === 1 ? 'відгук' : shopStats.totalCount < 5 ? 'відгуки' : 'відгуків'})
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
