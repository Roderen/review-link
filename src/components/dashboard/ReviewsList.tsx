import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Star, Eye, MessageSquare} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import {ReviewItem} from './ReviewItem';
import {DashboardReview} from '@/types/dashboard';

interface ReviewsListProps {
    reviews: DashboardReview[];
    reviewsCount: number;
    loading: boolean;
    publicUrl: string;
}

export const ReviewsList = ({reviews, reviewsCount, loading, publicUrl}: ReviewsListProps) => {
    return (
        <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                        <Star className="w-5 h-5 mr-2"/>
                        Последние отзывы
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(publicUrl, '_blank')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        <Eye className="w-4 h-4 mr-2"/>
                        Посмотреть все
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {reviewsCount === 0 && !loading ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4"/>
                        <p className="text-gray-400 mb-4">Пока нет отзывов</p>
                        <p className="text-sm text-gray-500">
                            Поделитесь ссылкой с клиентами, чтобы получить первые отзывы
                        </p>
                    </div>
                ) : loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="border border-gray-700 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <Skeleton
                                        circle
                                        width={40}
                                        height={40}
                                        baseColor="#2d2d2d"
                                        highlightColor="#3d3d3d"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <Skeleton
                                                    width={120}
                                                    height={20}
                                                    baseColor="#2d2d2d"
                                                    highlightColor="#3d3d3d"
                                                    style={{marginBottom: '8px'}}
                                                />
                                                <Skeleton
                                                    width={80}
                                                    height={16}
                                                    baseColor="#2d2d2d"
                                                    highlightColor="#3d3d3d"
                                                />
                                            </div>
                                            <Skeleton
                                                width={100}
                                                height={16}
                                                baseColor="#2d2d2d"
                                                highlightColor="#3d3d3d"
                                            />
                                        </div>
                                        <Skeleton
                                            count={2}
                                            baseColor="#2d2d2d"
                                            highlightColor="#3d3d3d"
                                            style={{marginBottom: '12px'}}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.slice(0, 5).map((review) => (
                            <ReviewItem key={review.id} review={review}/>
                        ))}
                        {reviewsCount > 5 && (
                            <div className="text-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => window.open(publicUrl, '_blank')}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                >
                                    Посмотреть все {reviewsCount} отзывов
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
