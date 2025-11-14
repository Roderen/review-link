import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { getPublicReviews } from '@/lib/firebase/services/reviews';
import { Review, SortOption } from '@/types/reviews-page';

const REVIEWS_PER_PAGE = 5;
const BATCH_SIZE = 50;

interface UseReviewsPaginationProps {
    shopId: string | undefined;
    shop: any;
    sortBy: SortOption;
    filterRating: number | null;
}

/**
 * Custom hook для управления пагинацией отзывов
 * Загружает отзывы батчами и управляет постраничным отображением
 */
export const useReviewsPagination = ({
    shopId,
    shop,
    sortBy,
    filterRating,
}: UseReviewsPaginationProps) => {
    const [loadedReviews, setLoadedReviews] = useState<Review[]>([]);
    const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentSnapshot<DocumentData> | null>(null);
    const [hasMoreInDB, setHasMoreInDB] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const loadingMoreRef = useRef(false);

    // Загрузка первого батча при изменении фильтров
    useEffect(() => {
        if (!shopId || !shop) return;

        const loadData = async () => {
            try {
                setLoading(true);
                setLoadedReviews([]);
                setLastVisibleDoc(null);
                setHasMoreInDB(true);
                setCurrentPage(1);

                const result = await getPublicReviews(shopId, {
                    limit: BATCH_SIZE,
                    sortBy: sortBy,
                    filterRating: filterRating,
                });

                if (typeof result === 'object' && result !== null && 'reviews' in result) {
                    setLoadedReviews(result.reviews as Review[]);
                    setLastVisibleDoc(result.lastVisible || null);
                    setHasMoreInDB(result.hasMore || false);
                    // Устанавливаем loading в false только после установки данных
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setLoading(false);
            }
        };

        loadData();
    }, [shopId, shop, sortBy, filterRating]);

    // Функция подгрузки следующего батча
    const loadMoreReviews = useCallback(async () => {
        if (!shopId || !hasMoreInDB || loadingMoreRef.current || !lastVisibleDoc) return;

        try {
            loadingMoreRef.current = true;
            setIsLoadingMore(true);

            const result = await getPublicReviews(shopId, {
                limit: BATCH_SIZE,
                sortBy: sortBy,
                filterRating: filterRating,
                startAfter: lastVisibleDoc,
            });

            if (typeof result === 'object' && result !== null && 'reviews' in result) {
                setLoadedReviews((prev) => [...prev, ...(result.reviews as Review[])]);
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

    // Автоматическая подгрузка при приближении к концу
    useEffect(() => {
        if (loading || loadingMoreRef.current) return;

        const totalPagesPossible = Math.ceil(loadedReviews.length / REVIEWS_PER_PAGE);

        if (currentPage >= totalPagesPossible - 1 && hasMoreInDB) {
            loadMoreReviews();
        }
    }, [currentPage, loadedReviews.length, hasMoreInDB, loading, loadMoreReviews]);

    // Вычисление данных для текущей страницы
    const paginationData = useMemo(() => {
        const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
        const endIndex = startIndex + REVIEWS_PER_PAGE;
        const currentReviews = loadedReviews.slice(startIndex, endIndex);
        const totalPages = Math.ceil(loadedReviews.length / REVIEWS_PER_PAGE);

        return { startIndex, endIndex, currentReviews, totalPages };
    }, [currentPage, loadedReviews]);

    // Обработчик смены страницы
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return {
        loadedReviews,
        loading,
        isLoadingMore,
        currentPage,
        totalPages: paginationData.totalPages,
        currentReviews: paginationData.currentReviews,
        startIndex: paginationData.startIndex,
        endIndex: paginationData.endIndex,
        handlePageChange,
    };
};
