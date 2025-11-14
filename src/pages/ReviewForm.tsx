import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.tsx';
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

/**
 * Форма для оставления отзыва клиентом
 * Поддерживает загрузку медиа, валидацию и проверку лимитов
 */
const ReviewForm = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [searchParams] = useSearchParams();
    const reviewLinkId = searchParams.get('linkId');

    // Custom hooks для управления состоянием
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
        media,
        isUploading,
        uploadMedia,
        removeMedia,
    } = useMediaUpload();

    const {
        canSubmit,
        limitType,
        loading: submissionLoading,
        isSubmitting,
        isSubmitted,
        shopStats,
        handleSubmit,
    } = useReviewSubmission({
        shopOwnerId: user?.id,
        reviewLinkId,
        isAuthLoading: authLoading,
    });

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

    // Guard clauses для early returns
    if (authLoading || submissionLoading || canSubmit === null) {
        return <StatusCard type="loading" />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (canSubmit === false) {
        const statusType = limitType === 'link-used' ? 'already-submitted' : 'limit-reached';
        return <StatusCard type={statusType} shopName={user.name} onClose={() => window.close()} />;
    }

    if (isSubmitted) {
        return <StatusCard type="success" shopName={user.name} onClose={() => window.close()} />;
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
