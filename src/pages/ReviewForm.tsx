import {useEffect, useState} from 'react';
import {Navigate, useSearchParams} from 'react-router-dom';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {MessageSquare} from 'lucide-react';
import {toast} from 'sonner';
import {useAuth} from "@/contexts/AuthContext.tsx";
import {canSubmitReview, canUseReviewLink, submitReview, getPublicReviewsStats} from "@/lib/firebase/services/reviews";
import {ShopInfoCard} from '@/components/review-form/ShopInfoCard';
import {RatingInput} from '@/components/review-form/RatingInput';
import {ReviewFormFields} from '@/components/review-form/ReviewFormFields';
import {MediaUploadSection} from '@/components/review-form/MediaUploadSection';
import {SubmitButton} from '@/components/review-form/SubmitButton';
import {FormDisclaimer} from '@/components/review-form/FormDisclaimer';
import {StatusCard} from '@/components/review-form/StatusCard';
import {ShopStats} from '@/types/review-form';

const ReviewForm = () => {
    const {user, isLoading: authLoading} = useAuth();
    const [searchParams] = useSearchParams();
    const reviewLinkId = searchParams.get('linkId'); // Получаем уникальный ID ссылки из URL

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [media, setMedia] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [canSubmit, setCanSubmit] = useState<boolean | null>(null);
    const [limitType, setLimitType] = useState<'shop-limit' | 'link-used' | null>(null);
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

                // Проверяем общий лимит отзывов для магазина
                const shopCanAcceptReviews = await canSubmitReview(shopOwnerId);

                if (!shopCanAcceptReviews) {
                    setCanSubmit(false);
                    setLimitType('shop-limit');
                    return;
                }

                // Проверяем, не использовалась ли уже эта ссылка для отзыва
                if (reviewLinkId) {
                    const linkCanBeUsed = await canUseReviewLink(reviewLinkId);

                    if (!linkCanBeUsed) {
                        setCanSubmit(false);
                        setLimitType('link-used');
                        return;
                    }
                }

                // Все проверки пройдены - можно отправлять
                setCanSubmit(true);
                setLimitType(null);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setCanSubmit(false);
                setLimitType('shop-limit'); // По умолчанию показываем общее сообщение об ошибке
            } finally {
                setLoading(false);
            }
        };

        // Проверяем только когда аутентификация завершена
        if (!authLoading && shopOwnerId) {
            loadData();
        }
    }, [shopOwnerId, authLoading, reviewLinkId]);

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
                reviewLinkId: reviewLinkId || undefined, // Передаем ID ссылки если есть
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

    // Показываем загрузку пока идет аутентификация, проверка лимита или данные еще не получены
    if (authLoading || loading || canSubmit === null) {
        return <StatusCard type="loading"/>;
    }

    // Редирект если нет пользователя
    if (!user) {
        return <Navigate to="/" replace/>;
    }

    // Показываем сообщение о лимите
    if (canSubmit === false) {
        const statusType = limitType === 'link-used' ? 'already-submitted' : 'limit-reached';
        return <StatusCard type={statusType} shopName={user.name} onClose={() => window.close()}/>;
    }

    // Показываем сообщение об успехе
    if (isSubmitted) {
        return <StatusCard type="success" shopName={user.name} onClose={() => window.close()}/>;
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4">
            <div className="max-w-2xl mx-auto">
                <ShopInfoCard
                    avatar={user.avatar}
                    name={user.name}
                    description={user.description}
                    shopStats={shopStats}
                />

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
                            <RatingInput
                                rating={rating}
                                hoverRating={hoverRating}
                                onRatingChange={setRating}
                                onHoverChange={setHoverRating}
                            />

                            <ReviewFormFields
                                name={name}
                                reviewText={reviewText}
                                onNameChange={setName}
                                onReviewTextChange={setReviewText}
                            />

                            <MediaUploadSection
                                media={media}
                                isUploading={isUploading}
                                onMediaUpload={handleMediaUpload}
                                onRemoveMedia={removeMedia}
                            />

                            <SubmitButton
                                isSubmitting={isSubmitting}
                                disabled={isSubmitting || !rating || !name.trim() || !reviewText.trim()}
                            />
                        </form>

                        <FormDisclaimer/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReviewForm;
