import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {MessageSquare, Filter, Star} from 'lucide-react';
import {RatingDistribution, SortOption} from '@/types/reviews-page';

interface StatsSidebarProps {
    ratingDistribution: RatingDistribution[];
    filterRating: number | null;
    sortBy: SortOption;
    onFilterChange: (rating: number | null) => void;
    onSortChange: (sort: SortOption) => void;
}

const sortOptions: {value: SortOption; label: string}[] = [
    {value: 'newest', label: 'Сначала новые'},
    {value: 'rating', label: 'По рейтингу'},
    {value: 'oldest', label: 'Сначала старые'}
];

export const StatsSidebar = ({
                                  ratingDistribution,
                                  filterRating,
                                  sortBy,
                                  onFilterChange,
                                  onSortChange
                              }: StatsSidebarProps) => {
    return (
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
                                onClick={() => onFilterChange(rating)}
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
                        {sortOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => onSortChange(option.value)}
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
                            onClick={() => onFilterChange(null)}
                            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            Сбросить фильтр
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
