import Skeleton from 'react-loading-skeleton';

interface ReviewsListHeaderProps {
    filterRating: number | null;
    loading: boolean;
}

export const ReviewsListHeader = ({filterRating, loading}: ReviewsListHeaderProps) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
                {loading ? (
                    <Skeleton
                        width={150}
                        height={28}
                        baseColor="#2d2d2d"
                        highlightColor="#3d3d3d"
                        style={{display: 'inline-block'}}
                    />
                ) : (
                    filterRating
                        ? `Відгуки з оцінкою ${filterRating} зірок`
                        : `Всі відгуки`
                )}
            </h2>
        </div>
    );
};
