import { useCallback, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { useShopData } from '@/hooks/useShopData';
import { useReviewsFilter } from '@/hooks/useReviewsFilter';
import { useReviewsPagination } from '@/hooks/useReviewsPagination';
import { useReviewsStats } from '@/hooks/useReviewsStats';
import { ShopHeader } from '@/components/reviews-page/ShopHeader';
import { StatsSidebar } from '@/components/reviews-page/StatsSidebar';
import { ReviewCard } from '@/components/reviews-page/ReviewCard';
import { EmptyState } from '@/components/reviews-page/EmptyState';
import { LoadingSkeleton } from '@/components/reviews-page/LoadingSkeleton';
import { Pagination } from '@/components/reviews-page/Pagination';
import { ReviewsFooter } from '@/components/reviews-page/ReviewsFooter';
import { ReviewsListHeader } from '@/components/reviews-page/ReviewsListHeader';

/**
 * Публичная страница отзывов магазина
 * Отображает отзывы с фильтрацией, сортировкой и пагинацией
 */
const PublicReviewsPage = () => {
    const params = useParams();
    const shopId = params.username;
    const { user } = useAuth();

    // Custom hooks для управления состоянием
    const { shop, loading: shopLoading, shopNotFound } = useShopData(shopId);
    const { sortBy, filterRating, handleFilterChange, handleSortChange } = useReviewsFilter();
    const { stats, reviewsCount } = useReviewsStats(shopId);

    const {
        loadedReviews,
        loading: reviewsLoading,
        isLoadingMore,
        currentPage,
        totalPages,
        currentReviews,
        startIndex,
        endIndex,
        handlePageChange,
    } = useReviewsPagination({
        shopId,
        shop,
        sortBy,
        filterRating,
    });

    // Обработчик удаления отзыва (только для админов)
    const handleDeleteReview = useCallback(
        async (reviewId: string) => {
            if (!reviewId) return;

            try {
                if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
                    return;
                }

                await deleteDoc(doc(db, 'reviews', reviewId));
                console.log('Отзыв успешно удален');
            } catch (error) {
                console.error('Ошибка при удалении отзыва:', error);
                alert('Не удалось удалить отзыв. Попробуйте еще раз.');
            }
        },
        []
    );

    // Мемоизируем распределение рейтингов
    const ratingDistribution = useMemo(
        () => stats?.ratingDistribution || [],
        [stats]
    );

    // Обработчики изменения фильтров с сбросом страницы
    const handleFilterChangeWithReset = useCallback(
        (rating: number | null) => {
            handleFilterChange(rating);
            handlePageChange(1);
        },
        [handleFilterChange, handlePageChange]
    );

    const handleSortChangeWithReset = useCallback(
        (sort: typeof sortBy) => {
            handleSortChange(sort);
            handlePageChange(1);
        },
        [handleSortChange, handlePageChange]
    );

    // Guard clauses для early returns
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

    const loading = reviewsLoading;

    return (
        <div className="min-h-screen bg-gray-950">
            <ShopHeader
                avatar={shop?.avatar}
                name={shop?.name}
                description={shop?.description}
                instagram={shop?.instagram}
                stats={stats}
                loading={shopLoading}
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar with Stats */}
                    <div className="lg:col-span-1">
                        <StatsSidebar
                            ratingDistribution={ratingDistribution}
                            filterRating={filterRating}
                            sortBy={sortBy}
                            onFilterChange={handleFilterChangeWithReset}
                            onSortChange={handleSortChangeWithReset}
                        />
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-3">
                        <ReviewsListHeader
                            filterRating={filterRating}
                            loading={loading && currentReviews.length === 0}
                        />

                        {currentReviews.length === 0 && !loading ? (
                            <EmptyState filterRating={filterRating} />
                        ) : loading && currentReviews.length === 0 ? (
                            <LoadingSkeleton />
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
                                            Страница {currentPage} из {totalPages} (
                                            {startIndex + 1}-
                                            {Math.min(endIndex, loadedReviews.length)} из{' '}
                                            {reviewsCount || loadedReviews.length} отзывов)
                                            {isLoadingMore && (
                                                <span className="ml-2 text-gray-500">
                                                    (загрузка...)
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ReviewsFooter />
        </div>
    );
};

export default PublicReviewsPage;
