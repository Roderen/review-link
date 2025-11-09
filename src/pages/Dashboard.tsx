import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Star, TrendingUp, Eye, MessageSquare} from 'lucide-react';
import {useAuth} from '@/contexts/AuthContext.tsx';
import {toast} from 'sonner';
import {getReviewsCount, getReviewsForShop} from "@/lib/firebase/reviewServise.ts";
import {generateReviewLinkId} from '@/lib/utils/generateLinkId';
import {DashboardHeader} from '@/components/dashboard/DashboardHeader';
import {PlanUsageCard} from '@/components/dashboard/PlanUsageCard';
import {StatsCard} from '@/components/dashboard/StatsCard';
import {LinksCard} from '@/components/dashboard/LinksCard';
import {ReviewsList} from '@/components/dashboard/ReviewsList';
import {DashboardReview, PlanLimits} from '@/types/dashboard';

const Dashboard = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<DashboardReview[]>([]);
    const [reviewsCount, setReviewsCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [reviewLinkId, setReviewLinkId] = useState<string>(() => generateReviewLinkId());

    useEffect(() => {
        if (user?.id) {
            getReviewsForShop(user.id, {
                limit: 10,
                skipPagination: true
            })
                .then(reviewsShop => {
                    console.log(reviewsShop)
                    // С skipPagination: true функция возвращает массив
                    if (Array.isArray(reviewsShop)) {
                        setReviews(reviewsShop as DashboardReview[])
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });

            getReviewsCount(user.id)
                .then(count => {
                    setReviewsCount(count);
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }, [user?.id]);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) return null;

    const baseUrl = import.meta.env.VITE_BASE_URL || '/';
    const reviewUrl = `${window.location.origin}${baseUrl}review/${user.id}?linkId=${reviewLinkId}`;
    const publicUrl = `${window.location.origin}${baseUrl}u/${user.id}`;

    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        toast.success(message);
    };

    const generateNewReviewLink = () => {
        const newLinkId = generateReviewLinkId();
        setReviewLinkId(newLinkId);
        toast.success('Новая ссылка для отзывов создана!');
    };

    const averageRating = reviewsCount > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount).toFixed(1)
        : '0';

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Вы вышли из системы');
    };

    const planLimits: Record<string, PlanLimits> = {
        free: {reviews: 10, name: 'Бесплатный'},
        business: {reviews: 500, name: 'Бизнес'},
        pro: {reviews: Infinity, name: 'Про'}
    };

    const currentPlan = planLimits[user.plan] || planLimits.free;
    const usagePercentage = currentPlan.reviews === Infinity
        ? 0
        : Math.min((reviewsCount / currentPlan.reviews) * 100, 100);

    return (
        <div className="min-h-screen bg-gray-950">
            <DashboardHeader
                userName={user.name}
                userAvatar={user.avatar}
                currentPlan={currentPlan}
                onLogout={handleLogout}
                showCrown={user.plan !== 'free'}
            />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <PlanUsageCard
                    currentPlan={currentPlan}
                    reviewsCount={reviewsCount}
                    usagePercentage={usagePercentage}
                    loading={loading}
                    showCrown={user.plan !== 'free'}
                    onChangePlan={() => navigate('/pricing')}
                />

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Всего отзывов"
                        value={reviewsCount}
                        icon={<MessageSquare className="w-8 h-8 text-gray-500"/>}
                        loading={loading}
                    />
                    <StatsCard
                        title="Средний рейтинг"
                        value={averageRating}
                        icon={<Star className="w-8 h-8 text-yellow-500"/>}
                        loading={loading}
                    />
                    <StatsCard
                        title="5-звездочных"
                        value={reviews.filter(r => r.rating === 5).length}
                        icon={<TrendingUp className="w-8 h-8 text-green-500"/>}
                        loading={loading}
                    />
                    <StatsCard
                        title="С медиа"
                        value={reviews.filter(r => r.media && r.media.length > 0).length}
                        icon={<Eye className="w-8 h-8 text-blue-500"/>}
                        loading={loading}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <LinksCard
                            reviewUrl={reviewUrl}
                            publicUrl={publicUrl}
                            onCopy={copyToClipboard}
                            onGenerateNewLink={generateNewReviewLink}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <ReviewsList
                            reviews={reviews}
                            reviewsCount={reviewsCount}
                            loading={loading}
                            publicUrl={publicUrl}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
