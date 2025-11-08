import {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import {useParams, Navigate} from 'react-router-dom';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {Star, MessageSquare, Filter, Play, ImageIcon, ChevronLeft, ChevronRight} from 'lucide-react';
import {getShopById, getPublicReviewsStats, getPublicReviews, getReviewsCount} from "@/lib/firebase/reviewServise.ts";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config.ts';
import { Trash2 } from 'lucide-react';
import {useAuth} from "@/contexts/AuthContext.tsx";

const REVIEWS_PER_PAGE = 5;
const BATCH_SIZE = 50;

interface Review {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    text: string;
    date: Date;
    media?: string[];
}

interface RatingDistribution {
    rating: number;
    count: number;
    percentage: number;
}

interface ReviewStats {
    totalCount: number;
    averageRating: number;
    ratingDistribution: RatingDistribution[];
}

const PublicReviewsPage = () => {
    const params = useParams();
    const shopId = params.username;
    const {user} = useAuth();

    const [shop, setShop] = useState<any>(null);
    const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'oldest'>('newest');
    const [filterRating, setFilterRating] = useState<number | null>(null);

    const [loadedReviews, setLoadedReviews] = useState<Review[]>([]);
    const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMoreInDB, setHasMoreInDB] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [allReviewsStats, setAllReviewsStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [shopNotFound, setShopNotFound] = useState(false);

    const [reviewsCount, setReviewsCount] = useState(0);

    const loadingMoreRef = useRef(false);

    useEffect(() => {
        if (!shopId) return;

        const fetchCount = async () => {
            try {
                const count = await getReviewsCount(shopId);
                setReviewsCount(count);
            } catch (error) {
                console.error('Ошибка загрузки счетчика:', error);
            }
        };

        fetchCount();
    }, [shopId]);

    useEffect(() => {
        if (!shopId) return;

        const loadShop = async () => {
            try {
                const shopData = await getShopById(shopId);
                setShop(shopData);
            } catch (error) {
                console.error('Ошибка загрузки магазина:', error);
                setShopNotFound(true);
            }
        };

        loadShop();
    }, [shopId]);

    const handleDeleteReview = useCallback(async (reviewId: string) => {
        if (!reviewId) return;

        try {
            if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
                return;
            }

            await deleteDoc(doc(db, 'reviews', reviewId));

            setLoadedReviews((prevReviews) =>
                prevReviews.filter((review) => review.id !== reviewId)
            );

            // Обновляем счетчик отзывов
            setReviewsCount((prevCount) => Math.max(0, prevCount - 1));

            console.log('Отзыв успешно удален');
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
            alert('Не удалось удалить отзыв. Попробуйте еще раз.');
        }
    }, []);

    useEffect(() => {
        if (!shopId || !shop) return;

        const loadData = async () => {
            try {
                setLoading(true);
                setLoadedReviews([]);
                setLastVisibleDoc(null);
                setHasMoreInDB(true);

                const stats = await getPublicReviewsStats(shopId);
                setAllReviewsStats(stats);

                const result = await getPublicReviews(shopId, {
                    limit: BATCH_SIZE,
                    sortBy: sortBy,
                    filterRating: filterRating
                });

                if (typeof result === 'object' && result !== null && 'reviews' in result) {
                    setLoadedReviews(result.reviews as Review[]);
                    setLastVisibleDoc(result.lastVisible || null);
                    setHasMoreInDB(result.hasMore || false);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [shopId, shop, sortBy, filterRating]);

    const loadMoreReviews = useCallback(async () => {
        if (!shopId || !hasMoreInDB || loadingMoreRef.current || !lastVisibleDoc) return;

        try {
            loadingMoreRef.current = true;
            setIsLoadingMore(true);

            const result = await getPublicReviews(shopId, {
                limit: BATCH_SIZE,
                sortBy: sortBy,
                filterRating: filterRating,
                startAfter: lastVisibleDoc
            });

            if (typeof result === 'object' && result !== null && 'reviews' in result) {
                setLoadedReviews(prev => [...prev, ...(result.reviews as Review[])]);
                setLastVisibleDoc(result.lastVisible || null);
                setHasMoreInDB(result.hasMore || false);
            }
        } catch (error) {
            console.error('Ошибка подгрузки отзывов:', error);
        } finally {
            setIsLoadingMore(false);
            loadingMoreRef.current = false;
        }
    }, [shopId, sortBy, filterRating, lastVisibleDoc, hasMoreInDB]);

    useEffect(() => {
        if (loading || loadingMoreRef.current) return;

        const totalPagesPossible = Math.ceil(loadedReviews.length / REVIEWS_PER_PAGE);

        if (currentPage >= totalPagesPossible - 1 && hasMoreInDB) {
            loadMoreReviews();
        }
    }, [currentPage, loadedReviews.length, hasMoreInDB, loading, loadMoreReviews]);

    // Мемоизируем вычисления для пагинации
    const paginationData = useMemo(() => {
        const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
        const endIndex = startIndex + REVIEWS_PER_PAGE;
        const currentReviews = loadedReviews.slice(startIndex, endIndex);
        const totalPages = Math.ceil(loadedReviews.length / REVIEWS_PER_PAGE);

        return { startIndex, endIndex, currentReviews, totalPages };
    }, [currentPage, loadedReviews]);

    const { startIndex, endIndex, currentReviews, totalPages } = paginationData;

    // Мемоизируем статистику
    const statsData = useMemo(() => {
        const averageRating = allReviewsStats?.averageRating?.toFixed(1) || '0';
        const ratingDistribution = allReviewsStats?.ratingDistribution || [];
        return { averageRating, ratingDistribution };
    }, [allReviewsStats]);

    const { averageRating, ratingDistribution } = statsData;

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleFilterChange = useCallback((rating: number | null) => {
        setFilterRating(prev => prev === rating ? null : rating);
        setCurrentPage(1);
    }, []);

    const handleSortChange = useCallback((sort: 'newest' | 'rating' | 'oldest') => {
        setSortBy(sort);
        setCurrentPage(1);
    }, []);

    if (shopNotFound) {
        return <Navigate to="/404" replace />;
    }

    if (!shopId) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl text-white mb-4">Ошибка</h2>
                    <p className="text-gray-400">ID магазина не найден в URL</p>
                </div>
            </div>
        );
    }

    if (loading && !shop) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <div className="bg-gray-900 shadow-sm border-b border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center space-x-6">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={shop?.avatar} alt={shop?.name}/>
                            <AvatarFallback className="text-xl">{shop?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2 text-white">{shop?.name || 'Магазин'}</h1>
                            <p className="text-gray-400 mb-3">{shop?.description || 'Нет описания'}</p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    {!allReviewsStats ? (
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
                                            <span className="text-gray-400">({allReviewsStats.totalCount} отзывов)</span>
                                        </>
                                    )}
                                </div>
                                {shop?.instagram && (
                                    <Badge variant="outline" className="px-3 py-1 border-gray-600 text-gray-300">
                                        @{shop.instagram}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar with Stats */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4 bg-gray-900 border-gray-700">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4 flex items-center text-white">
                                    <MessageSquare className="w-5 h-5 mr-2"/>
                                    Статистика отзывов
                                </h3>

                                {/* Rating Distribution */}
                                <div className="space-y-3 mb-6">
                                    {ratingDistribution.map(({rating, count, percentage}) => (
                                        <div key={rating} className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleFilterChange(rating)}
                                                className={`flex items-center space-x-1 text-sm hover:bg-gray-800 px-2 py-1 rounded transition-colors ${
                                                    filterRating === rating ? 'bg-gray-700 text-white' : 'text-gray-400'
                                                }`}
                                            >
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
                                                <span>{rating}</span>
                                            </button>
                                            <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-gray-500 h-full rounded-full transition-all"
                                                    style={{width: `${percentage}%`}}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-400 w-8 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Filters */}
                                <div className="border-t border-gray-700 pt-4">
                                    <h4 className="font-medium mb-3 flex items-center text-white">
                                        <Filter className="w-4 h-4 mr-2"/>
                                        Сортировка
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            {value: 'newest', label: 'Сначала новые'},
                                            {value: 'rating', label: 'По рейтингу'},
                                            {value: 'oldest', label: 'Сначала старые'}
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSortChange(option.value as any)}
                                                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                                    sortBy === option.value
                                                        ? 'bg-gray-700 text-white font-medium'
                                                        : 'text-gray-400 hover:bg-gray-800'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {filterRating && (
                                    <div className="border-t border-gray-700 pt-4 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleFilterChange(null)}
                                            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                                        >
                                            Сбросить фильтр
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">
                                {loading && currentReviews.length === 0 ? (
                                    <Skeleton
                                        width={150}
                                        height={28}
                                        baseColor="#2d2d2d"
                                        highlightColor="#3d3d3d"
                                        style={{display: 'inline-block'}}
                                    />
                                ) : (
                                    filterRating
                                        ? `Отзывы с оценкой ${filterRating} звезд`
                                        : `Все отзывы`
                                )}
                            </h2>
                        </div>

                        {currentReviews.length === 0 && !loading ? (
                            <Card className="bg-gray-900 border-gray-700">
                                <CardContent className="text-center py-12">
                                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4"/>
                                    <p className="text-gray-400">
                                        {filterRating
                                            ? `Нет отзывов с оценкой ${filterRating} звезд`
                                            : 'Пока нет отзывов'
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        ) : loading && currentReviews.length === 0 ? (
                            <div className="space-y-6">
                                {[...Array(3)].map((_, index) => (
                                    <Card key={index} className="bg-gray-900 border-gray-700">
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <Skeleton
                                                    circle
                                                    width={48}
                                                    height={48}
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
                                                                width={150}
                                                                height={16}
                                                                baseColor="#2d2d2d"
                                                                highlightColor="#3d3d3d"
                                                            />
                                                        </div>
                                                        <Skeleton
                                                            width={50}
                                                            height={24}
                                                            baseColor="#2d2d2d"
                                                            highlightColor="#3d3d3d"
                                                        />
                                                    </div>
                                                    <Skeleton
                                                        count={1}
                                                        baseColor="#2d2d2d"
                                                        highlightColor="#3d3d3d"
                                                        style={{marginBottom: '16px'}}
                                                    />
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {[...Array(3)].map((_, i) => (
                                                            <Skeleton
                                                                key={i}
                                                                height={96}
                                                                baseColor="#2d2d2d"
                                                                highlightColor="#3d3d3d"
                                                                style={{borderRadius: '8px'}}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    {currentReviews.map((review, index) => (
                                        <Card key={review.id || index}
                                              className="hover:shadow-md transition-shadow bg-gray-900 border-gray-700">
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-4">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarImage src={review.avatar} alt={review.name}/>
                                                        <AvatarFallback>{review.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-medium text-white">{review.name}</h4>
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="flex space-x-1">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Star
                                                                                key={star}
                                                                                className={`w-4 h-4 ${
                                                                                    star <= review.rating
                                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                                        : 'text-gray-600'
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-sm text-gray-500">
                                {review.date?.toLocaleDateString()}
                            </span>
                                                                </div>
                                                            </div>
                                                            {user?.role === 'admin' && (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => handleDeleteReview(review.id)}
                                                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                                                        aria-label="Delete review"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-gray-300 mb-4 leading-relaxed">{review.text}</p>

                                                        {review.media && review.media.length > 0 && (
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                                {review.media.map((media: string, mediaIndex: number) => (
                                                                    <Dialog key={mediaIndex}>
                                                                        <DialogTrigger asChild>
                                                                            <div className="relative group cursor-pointer">
                                                                                <img
                                                                                    src={media}
                                                                                    alt={`Review media ${mediaIndex + 1}`}
                                                                                    className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                                                                />
                                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                                                                    {media.includes('video') ? (
                                                                                        <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                                                    ) : (
                                                                                        <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </DialogTrigger>
                                                                        <DialogContent className="max-w-4xl w-full p-0 bg-gray-900 border-gray-700">
                                                                            <div className="relative">
                                                                                <img
                                                                                    src={media}
                                                                                    alt={`Review media ${mediaIndex + 1}`}
                                                                                    className="w-full h-auto max-h-[80vh] object-contain"
                                                                                />
                                                                            </div>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center space-x-2 mt-8">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1"/>
                                            Назад
                                        </Button>

                                        <div className="flex items-center space-x-1">
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                const isCurrentPage = pageNumber === currentPage;

                                                if (
                                                    pageNumber === 1 ||
                                                    pageNumber === totalPages ||
                                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <Button
                                                            key={pageNumber}
                                                            variant={isCurrentPage ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => handlePageChange(pageNumber)}
                                                            className={
                                                                isCurrentPage
                                                                    ? "bg-gray-700 text-white border-gray-600"
                                                                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                                                            }
                                                        >
                                                            {pageNumber}
                                                        </Button>
                                                    );
                                                } else if (
                                                    pageNumber === currentPage - 2 ||
                                                    pageNumber === currentPage + 2
                                                ) {
                                                    return <span key={pageNumber} className="text-gray-500 px-1">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Вперед
                                            <ChevronRight className="w-4 h-4 ml-1"/>
                                        </Button>
                                    </div>
                                )}

                                {/* Page info */}
                                {totalPages > 1 && (
                                    <div className="text-center mt-4 text-sm text-gray-400">
                                        Страница {currentPage} из {totalPages} ({startIndex + 1}-{Math.min(endIndex, loadedReviews.length)} из {reviewsCount || loadedReviews.length} отзывов)
                                        {isLoadingMore && <span className="ml-2 text-gray-500">(загрузка...)</span>}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-gray-900 mt-16">
                <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div
                            className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white"/>
                        </div>
                        <span className="font-semibold text-white">
              ReviewLink
            </span>
                    </div>
                    <p className="text-sm text-gray-500">
                        Красивые отзывы для Instagram магазинов • reviewlink.com
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PublicReviewsPage;