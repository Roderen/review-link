export interface Review {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    text: string;
    date: Date;
    media?: string[];
}

export interface RatingDistribution {
    rating: number;
    count: number;
    percentage: number;
}

export interface ReviewStats {
    totalCount: number;
    averageRating: number;
    ratingDistribution: RatingDistribution[];
}

export type SortOption = 'newest' | 'rating' | 'oldest';
