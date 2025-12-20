import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Star} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import {ReviewStats} from '@/types/reviews-page';

interface ShopHeaderProps {
    avatar?: string;
    name?: string;
    description?: string;
    instagram?: string;
    stats: ReviewStats | null;
    loading?: boolean;
}

export const ShopHeader = ({avatar, name, description, instagram, stats, loading = false}: ShopHeaderProps) => {
    const averageRating = stats?.averageRating?.toFixed(1) || '0';

    return (
        <div className="bg-gray-900 shadow-sm border-b border-gray-800">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center space-x-6">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={avatar} alt={name}/>
                        <AvatarFallback className="text-xl">
                            {
                                name?.charAt(0)
                                ||
                                <Skeleton
                                    width={80}
                                    height={80}
                                    baseColor="#2d2d2d"
                                    highlightColor="#3d3d3d"
                                    style={{display: 'inline-block'}}
                                />
                            }
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2 text-white">
                            {loading ? (
                                <Skeleton
                                    width={200}
                                    height={36}
                                    baseColor="#2d2d2d"
                                    highlightColor="#3d3d3d"
                                    style={{display: 'inline-block'}}
                                />
                            ) : (
                                name || 'Магазин'
                            )}
                        </h1>
                        <p className="text-gray-400 mb-3">
                            {loading ? (
                                <Skeleton
                                    width={300}
                                    height={20}
                                    baseColor="#2d2d2d"
                                    highlightColor="#3d3d3d"
                                    style={{display: 'inline-block'}}
                                />
                            ) : (
                                description || 'Немає опису'
                            )}
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {!stats ? (
                                    <>
                                        <Skeleton
                                            width={115}
                                            height={20}
                                            baseColor="#2d2d2d"
                                            highlightColor="#3d3d3d"
                                            style={{display: 'inline-block'}}
                                        />
                                        <Skeleton
                                            width={30}
                                            height={25}
                                            baseColor="#2d2d2d"
                                            highlightColor="#3d3d3d"
                                            style={{display: 'inline-block'}}
                                        />
                                        <Skeleton
                                            width={85}
                                            height={25}
                                            baseColor="#2d2d2d"
                                            highlightColor="#3d3d3d"
                                            style={{display: 'inline-block'}}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-5 h-5 ${
                                                        star <= Math.floor(parseFloat(averageRating))
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-600'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-lg font-semibold text-white">{averageRating}</span>
                                        <span className="text-gray-400">({stats.totalCount} відгуків)</span>
                                    </>
                                )}
                            </div>
                            {instagram && (
                                <Badge variant="outline" className="px-3 py-1 border-gray-600 text-gray-300">
                                    @{instagram}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
