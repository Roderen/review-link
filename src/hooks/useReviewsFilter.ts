import { useState, useCallback } from 'react';
import { SortOption } from '@/types/reviews-page';

/**
 * Custom hook для управления фильтрацией и сортировкой отзывов
 * @returns Состояние и методы для фильтрации/сортировки
 */
export const useReviewsFilter = () => {
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [filterRating, setFilterRating] = useState<number | null>(null);

    /**
     * Обработчик изменения фильтра по рейтингу
     * Если кликнули на тот же рейтинг - сбрасываем фильтр
     */
    const handleFilterChange = useCallback((rating: number | null) => {
        setFilterRating(prev => prev === rating ? null : rating);
    }, []);

    /**
     * Обработчик изменения сортировки
     */
    const handleSortChange = useCallback((sort: SortOption) => {
        setSortBy(sort);
    }, []);

    /**
     * Сброс всех фильтров
     */
    const resetFilters = useCallback(() => {
        setSortBy('newest');
        setFilterRating(null);
    }, []);

    return {
        sortBy,
        filterRating,
        handleFilterChange,
        handleSortChange,
        resetFilters,
    };
};
