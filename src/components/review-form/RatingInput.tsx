import {Label} from '@/components/ui/label';
import {Star} from 'lucide-react';

interface RatingInputProps {
    rating: number;
    hoverRating: number;
    onRatingChange: (rating: number) => void;
    onHoverChange: (rating: number) => void;
}

const ratingMessages: Record<number, string> = {
    5: 'Отлично! ⭐',
    4: 'Хорошо! 👍',
    3: 'Нормально 👌',
    2: 'Не очень 👎',
    1: 'Плохо 😞'
};

export const RatingInput = ({rating, hoverRating, onRatingChange, onHoverChange}: RatingInputProps) => {
    return (
        <div>
            <Label className="text-base font-medium text-white">Ваша оценка *</Label>
            <div className="flex space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRatingChange(star)}
                        onMouseEnter={() => onHoverChange(star)}
                        onMouseLeave={() => onHoverChange(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-8 h-8 ${
                                star <= (hoverRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-600 hover:text-yellow-200'
                            } transition-colors`}
                        />
                    </button>
                ))}
            </div>
            {rating > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                    {ratingMessages[rating]}
                </p>
            )}
        </div>
    );
};
