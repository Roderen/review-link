import {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Star, Upload, X, Check, MessageSquare, Camera, Video} from 'lucide-react';
import {toast} from 'sonner';
import {useAuth} from "@/contexts/AuthContext.tsx";
import {canSubmitReview, submitReview, getPublicReviewsStats} from "@/lib/firebase/reviewServise.ts";

interface ShopStats {
    totalCount: number;
    averageRating: number;
}

const ReviewForm = () => {
    const {user, isLoading: authLoading} = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [media, setMedia] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [canSubmit, setCanSubmit] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [shopStats, setShopStats] = useState<ShopStats | null>(null);

    const shopOwnerId = user?.id;

    useEffect(() => {
        const loadData = async () => {
            if (!shopOwnerId) return;

            setLoading(true);
            try {
                // Загружаем статистику магазина
                const stats = await getPublicReviewsStats(shopOwnerId);
                setShopStats({
                    totalCount: stats.totalCount,
                    averageRating: stats.averageRating
                });

                // Проверяем возможность добавить отзыв
                const result = await canSubmitReview(shopOwnerId);
                setCanSubmit(result);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setCanSubmit(false);
            } finally {
                setLoading(false);
            }
        };

        // Проверяем только когда аутентификация завершена
        if (!authLoading && shopOwnerId) {
            loadData();
        }
    }, [shopOwnerId, authLoading]);

    // Показываем загрузку пока идет аутентификация, проверка лимита или данные еще не получены
    if (authLoading || loading || canSubmit === null) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white">Загрузка...</div>
            </div>
        );
    }

    // Редирект если нет пользователя
    if (!user) {
        return <Navigate to="/" replace/>;
    }

    // Показываем сообщение о лимите
    if (canSubmit === false) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center bg-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                        <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-red-400"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Лимит отзывов достигнут</h2>
                        <p className="text-gray-400 mb-6">
                            К сожалению, для магазина {user.name || 'данного магазина'} достигнут лимит по количеству отзывов.
                        </p>
                        <Button
                            onClick={() => window.close()}
                            className="w-full bg-gray-700 hover:bg-gray-600"
                        >
                            Закрыть
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setIsUploading(true);
            try {
                const uploadPromises = Array.from(files).slice(0, 5 - media.length).map(async (file) => {
                    const formData = new FormData();
                    formData.append('UPLOADCARE_PUB_KEY', 'acb1f0d9f083d1dac8d6');
                    formData.append('file', file);

                    const response = await fetch('https://upload.uploadcare.com/base/', {
                        method: 'POST',
                        body: formData,
                    });

                    const data = await response.json();
                    return `https://2jzkd06n6i.ucarecd.net/${data.file}/`;
                });

                const uploadedUrls = await Promise.all(uploadPromises);
                setMedia(prev => [...prev, ...uploadedUrls]);
                toast.success('Изображения загружены!');

            } catch (error) {
                console.error('Ошибка загрузки:', error);
                toast.error('Ошибка при загрузке изображений');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const removeMedia = (index: number) => {
        setMedia(media.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating || !name.trim() || !reviewText.trim()) {
            toast.error('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (!shopOwnerId) {
            toast.error('Ошибка: идентификатор магазина не найден');
            return;
        }

        setIsSubmitting(true);

        try {
            await submitReview({
                shopOwnerId,
                customerName: name,
                rating,
                text: reviewText,
                ...(media.length > 0 && {media})
            });

            setIsSubmitting(false);
            setIsSubmitted(true);
            toast.success('Спасибо за ваш отзыв!');
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
            toast.error('Ошибка при отправке отзыва');
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center bg-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                        <div
                            className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-400"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Отзыв отправлен!</h2>
                        <p className="text-gray-400 mb-6">
                            Спасибо за ваш отзыв о магазине {user.name || 'магазина'}.
                            Он поможет другим покупателям сделать правильный выбор.
                        </p>
                        <Button
                            onClick={() => window.close()}
                            className="w-full bg-gray-700 hover:bg-gray-600"
                        >
                            Закрыть
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Shop Header */}
                <Card className="mb-6 bg-gray-900 border-gray-700">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={user.avatar} alt={user.name}/>
                                <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{user.name || 'Магазин'}</h1>
                                <p className="text-gray-400">{user.description || 'Описание отсутствует'}</p>
                                {shopStats && (
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= Math.floor(shopStats.averageRating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-600'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-400">
                                            {shopStats.averageRating.toFixed(1)} ({shopStats.totalCount} {shopStats.totalCount === 1 ? 'отзыв' : shopStats.totalCount < 5 ? 'отзыва' : 'отзывов'})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Review Form */}
                <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center text-white">
                            <MessageSquare className="w-5 h-5 mr-2"/>
                            Оставить отзыв
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating */}
                            <div>
                                <Label className="text-base font-medium text-white">Ваша оценка *</Label>
                                <div className="flex space-x-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
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
                                        {rating === 5 && 'Отлично! ⭐'}
                                        {rating === 4 && 'Хорошо! 👍'}
                                        {rating === 3 && 'Нормально 👌'}
                                        {rating === 2 && 'Не очень 👎'}
                                        {rating === 1 && 'Плохо 😞'}
                                    </p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <Label htmlFor="name" className="text-base font-medium text-white">Ваше имя *</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Как к вам обращаться?"
                                    className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                                />
                            </div>

                            {/* Review Text */}
                            <div>
                                <Label htmlFor="review" className="text-base font-medium text-white">Ваш отзыв *</Label>
                                <Textarea
                                    id="review"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Расскажите о своем опыте покупки. Что вам понравилось? Качество товара, доставка, общение с продавцом..."
                                    className="mt-2 min-h-32 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                                />
                            </div>

                            {/* Media Upload */}
                            <div>
                                <Label className="text-base font-medium text-white">Фото и видео (необязательно)</Label>
                                <p className="text-sm text-gray-400 mb-3">
                                    Добавьте фото товара или видео-отзыв, чтобы помочь другим покупателям
                                </p>

                                {media.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        {media.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Media ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {media.length < 5 && (
                                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                                        <input
                                            type="file"
                                            id="media"
                                            multiple
                                            accept="image/*,video/*"
                                            onChange={handleMediaUpload}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                        <label
                                            htmlFor="media"
                                            className="cursor-pointer flex flex-col items-center space-y-2"
                                        >
                                            <div className="flex items-center space-x-2 text-gray-500">
                                                <Camera className="w-6 h-6"/>
                                                <Video className="w-6 h-6"/>
                                                <Upload className="w-6 h-6"/>
                                            </div>
                                            <span className="text-gray-400">
                                                {isUploading ? 'Загрузка...' : 'Нажмите для загрузки фото или видео'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Максимум 5 файлов
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full text-lg py-6 bg-gray-700 hover:bg-gray-600"
                                disabled={isSubmitting || !rating || !name.trim() || !reviewText.trim()}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Отправляем отзыв...
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare className="w-5 h-5 mr-2"/>
                                        Отправить отзыв
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400">
                                <strong className="text-gray-300">Важно:</strong> Ваш отзыв будет опубликован на
                                публичной странице магазина.
                                Пожалуйста, будьте честны и конструктивны в своих комментариях.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReviewForm;