import {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import {useParams, Navigate} from 'react-router-dom';
import {getPublicReviewsStats, getPublicReviews, getReviewsCount} from "@/lib/firebase/services/reviews";
import {getShopById} from "@/lib/firebase/services/shops";
import type {QueryDocumentSnapshot, DocumentData} from 'firebase/firestore';
import {deleteDoc, doc} from 'firebase/firestore';
import {db} from '@/lib/firebase/firebase-config.ts';
import {useAuth} from "@/contexts/AuthContext.tsx";
import {ShopHeader} from '@/components/reviews-page/ShopHeader';
import {StatsSidebar} from '@/components/reviews-page/StatsSidebar';
import {ReviewCard} from '@/components/reviews-page/ReviewCard';
import {EmptyState} from '@/components/reviews-page/EmptyState';
import {LoadingSkeleton} from '@/components/reviews-page/LoadingSkeleton';
import {Pagination} from '@/components/reviews-page/Pagination';
import {ReviewsFooter} from '@/components/reviews-page/ReviewsFooter';
import {ReviewsListHeader} from '@/components/reviews-page/ReviewsListHeader';
import {Review, ReviewStats, SortOption} from '@/types/reviews-page';

const REVIEWS_PER_PAGE = 5;
const BATCH_SIZE = 50;

const PublicReviewsPage = () => {
    const params = useParams();
    const shopId = params.username;
    const {user} = useAuth();

    const [shop, setShop] = useState<any>(null);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
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

        return {startIndex, endIndex, currentReviews, totalPages};
    }, [currentPage, loadedReviews]);

    const {startIndex, endIndex, currentReviews, totalPages} = paginationData;

    // Мемоизируем статистику
    const statsData = useMemo(() => {
        const ratingDistribution = allReviewsStats?.ratingDistribution || [];
        return {ratingDistribution};
    }, [allReviewsStats]);

    const {ratingDistribution} = statsData;

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, []);

    const handleFilterChange = useCallback((rating: number | null) => {
        setFilterRating(prev => prev === rating ? null : rating);
        setCurrentPage(1);
    }, []);

    const handleSortChange = useCallback((sort: SortOption) => {
        setSortBy(sort);
        setCurrentPage(1);
    }, []);

    if (shopNotFound) {
        return <Navigate to="/404" replace/>;
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
            <ShopHeader
                avatar={shop?.avatar}
                name={shop?.name}
                description={shop?.description}
                instagram={shop?.instagram}
                stats={allReviewsStats}
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar with Stats */}
                    <div className="lg:col-span-1">
                        <StatsSidebar
                            ratingDistribution={ratingDistribution}
                            filterRating={filterRating}
                            sortBy={sortBy}
                            onFilterChange={handleFilterChange}
                            onSortChange={handleSortChange}
                        />
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-3">
                        <ReviewsListHeader filterRating={filterRating} loading={loading && currentReviews.length === 0}/>

                        {currentReviews.length === 0 && !loading ? (
                            <EmptyState filterRating={filterRating}/>
                        ) : loading && currentReviews.length === 0 ? (
                            <LoadingSkeleton/>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    {currentReviews.map((review) => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                            showDeleteButton={user?.role === 'admin'}
                                            onDelete={handleDeleteReview}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />

                                        {/* Page info */}
                                        <div className="text-center mt-4 text-sm text-gray-400">
                                            Страница {currentPage} из {totalPages} ({startIndex +
                                            1}-{Math.min(endIndex, loadedReviews.length)} из {reviewsCount || loadedReviews.length} отзывов)
                                            {isLoadingMore && <span className="ml-2 text-gray-500">(загрузка...)</span>}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ReviewsFooter/>
        </div>
    );
};

export default PublicReviewsPage;
