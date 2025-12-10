import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useReviewSubmission } from '@/hooks/useReviewSubmission';
import { ShopInfoCard } from '@/components/review-form/ShopInfoCard';
import { RatingInput } from '@/components/review-form/RatingInput';
import { ReviewFormFields } from '@/components/review-form/ReviewFormFields';
import { MediaUploadSection } from '@/components/review-form/MediaUploadSection';
import { SubmitButton } from '@/components/review-form/SubmitButton';
import { FormDisclaimer } from '@/components/review-form/FormDisclaimer';
import { StatusCard } from '@/components/review-form/StatusCard';
import { useShopData } from '@/hooks/useShopData.ts';
import { useReviewsStats } from '@/hooks/useReviewsStats.ts';

/**
 * Форма для оставления отзыва клиентом
 * Поддерживает загрузку медиа, валидацию и проверку лимитов
 */
const ReviewForm = () => {
    const params = useParams();
    const shopId = params.username;
    const [searchParams] = useSearchParams();
    const reviewLinkId = searchParams.get('linkId');

    // Custom hooks для загрузки данных магазина
    const { shop, loading: shopLoading, shopNotFound } = useShopData(shopId);
    const { stats } = useReviewsStats(shopId);

    // Custom hooks для управления состоянием формы
    const {
        rating,
        hoverRating,
        name,
        reviewText,
        setRating,
        setHoverRating,
        setName,
        setReviewText,
        isValid,
    } = useFormValidation();

    const {
        canSubmit,
        limitType,
        isSubmitting,
        isSubmitted,
        ownerPlan,
        isOwnerPlanLoaded,
        handleSubmit,
    } = useReviewSubmission({
        shopOwnerId: shop?.id,
        reviewLinkId,
        isAuthLoading: shopLoading,
    });

    const {
        media,
        isUploading,
        uploadMedia,
        removeMedia,
        maxMediaCount,
    } = useMediaUpload(isOwnerPlanLoaded ? ownerPlan : 'FREE');

    // Debug logging
    console.log('🔍 ReviewForm - isOwnerPlanLoaded:', isOwnerPlanLoaded, 'ownerPlan:', ownerPlan, 'maxMediaCount:', maxMediaCount);

    // Обработчик отправки формы
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await handleSubmit({
            customerName: name,
            rating,
            text: reviewText,
            media: media.length > 0 ? media : undefined,
        });
    };

    // Обработчик загрузки медиа
    const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        uploadMedia(event.target.files);
    };

    // Guard clauses для early returns (в том же порядке что и в PublicReviewsPage)
    if (shopNotFound) {
        return <Navigate to="/404" replace />;
    }

    if (!shopId) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl text-white mb-4">Ошибка</h2>
                    <p className="text-gray-400">ID магазина не найден в URL</p>
                </div>
            </div>
        );
    }

    // Показываем loading только пока грузятся данные магазина
    if (shopLoading) {
        return <StatusCard type="loading" />;
    }

    // Проверяем статусы отправки
    if (canSubmit === false) {
        const statusType = limitType === 'link-used' ? 'already-submitted' : 'limit-reached';
        return <StatusCard type={statusType} shopName={shop?.name} onClose={() => window.close()} />;
    }

    if (isSubmitted) {
        return <StatusCard type="success" shopName={shop?.name} onClose={() => window.close()} />;
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4">
            <div className="max-w-2xl mx-auto">
                <ShopInfoCard
                    avatar={shop?.avatar}
                    name={shop?.name}
                    description={shop?.description}
                    shopStats={stats}
                />

                {/* Review Form */}
                <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center text-white">
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Оставить отзыв
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
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
                                maxMediaCount={maxMediaCount}
                            />

                            <SubmitButton
                                isSubmitting={isSubmitting}
                                disabled={isSubmitting || !isValid}
                            />
                        </form>

                        <FormDisclaimer />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReviewForm;