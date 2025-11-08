import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Star} from 'lucide-react';
import {DashboardReview} from '@/types/dashboard';

interface ReviewItemProps {
    review: DashboardReview;
}

export const ReviewItem = ({review}: ReviewItemProps) => {
    return (
        <div className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
            <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={review.avatar} alt={review.name}/>
                    <AvatarFallback>{review.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h4 className="font-medium text-white">{review.name}</h4>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">{review.date?.toLocaleDateString()}</span>
                            </div>
                        </div>
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
                    </div>
                    <p className="text-gray-300 mb-3">{review.text}</p>
                    {review.media && review.media.length > 0 && (
                        <div className="flex space-x-2">
                            {review.media.map((media, index) => (
                                <div key={index}
                                     className="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                                    <img
                                        src={media}
                                        alt="Review media"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
