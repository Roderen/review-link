import {Card, CardContent} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {Star, Play, ImageIcon, Trash2} from 'lucide-react';
import {Review} from '@/types/reviews-page';

interface ReviewCardProps {
    review: Review;
    showDeleteButton: boolean;
    onDelete: (reviewId: string) => void;
}

export const ReviewCard = ({review, showDeleteButton, onDelete}: ReviewCardProps) => {
    // Проверяет, является ли URL видео-файлом
    const isVideo = (url: string) => {
        return url.includes('/video/') || /\.(mp4|webm|ogg|mov)$/i.test(url);
    };

    return (
        <Card className="hover:shadow-md transition-shadow bg-gray-900 border-gray-700">
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
                            {showDeleteButton && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onDelete(review.id)}
                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                        aria-label="Delete review"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-gray-300 mb-4 leading-relaxed">{review.text}</p>

                        {review.media && review.media.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {review.media.map((media: string, mediaIndex: number) => {
                                    const mediaIsVideo = isVideo(media);

                                    return (
                                        <Dialog key={mediaIndex}>
                                            <DialogTrigger asChild>
                                                <div className="relative group cursor-pointer">
                                                    {mediaIsVideo ? (
                                                        <video
                                                            src={media}
                                                            className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                                            muted
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <img
                                                            src={media}
                                                            alt={`Review media ${mediaIndex + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                                        />
                                                    )}
                                                    <div
                                                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                                        {mediaIsVideo ? (
                                                            <Play
                                                                className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                        ) : (
                                                            <ImageIcon
                                                                className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl w-full p-0 bg-gray-900 border-gray-700">
                                                <div className="relative">
                                                    {mediaIsVideo ? (
                                                        <video
                                                            src={media}
                                                            className="w-full h-auto max-h-[80vh] object-contain"
                                                            controls
                                                            autoPlay
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <img
                                                            src={media}
                                                            alt={`Review media ${mediaIndex + 1}`}
                                                            className="w-full h-auto max-h-[80vh] object-contain"
                                                        />
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
