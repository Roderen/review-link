import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Copy, ExternalLink, Star, Users, TrendingUp, LogOut, Eye, MessageSquare, Crown} from 'lucide-react';
import {useAuth} from '@/contexts/AuthContext.tsx';
import {toast} from 'sonner';
import {getReviewsForShop} from "@/lib/firebase/reviewServise.ts";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

interface DashboardReview {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    text: string;
    date: Date;
    media?: string[];
}

const Dashboard = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<DashboardReview[]>([]);
    const [loading, setLoading] = useState(true);

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
        }
    }, [user?.id]); // Зависимость от user.id

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) return null;

    const baseUrl = import.meta.env.VITE_BASE_URL || '/';
    const reviewUrl = `${window.location.origin}${baseUrl}review/${user.id}`;
    const publicUrl = `${window.location.origin}${baseUrl}u/${user.id}`;

    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        toast.success(message);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : '0';

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Вы вышли из системы');
    };

    const planLimits: Record<string, {reviews: number, name: string}> = {
        free: {reviews: 10, name: 'Бесплатный'},
        starter: {reviews: 50, name: 'Стартовый'},
        basic: {reviews: 100, name: 'Базовый'},
        business: {reviews: 500, name: 'Бизнес'},
        pro: {reviews: Infinity, name: 'Про'}
    };

    const currentPlan = planLimits[user.plan] || planLimits.free;
    const usagePercentage = currentPlan.reviews === Infinity
        ? 0
        : Math.min((reviews.length / currentPlan.reviews) * 100, 100);

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Панель управления
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name}/>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-right">
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400 flex items-center">
                                {user.plan !== 'free' && <Crown className="w-3 h-3 mr-1"/>}
                                {currentPlan.name}
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800">
                            <LogOut className="w-4 h-4 mr-2"/>
                            Выйти
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Plan Usage */}
                <Card className="mb-8 bg-gray-900 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    {user.plan !== 'free' && <Crown className="w-5 h-5 mr-2 text-yellow-500"/>}
                                    Тариф: {currentPlan.name}
                                </h3>
                                <p className="text-gray-400">
                                    {loading ? (
                                        <Skeleton
                                            width={150}
                                            height={20}
                                            baseColor="#2d2d2d"
                                            highlightColor="#3d3d3d"
                                            style={{display: 'inline-block'}}
                                        />
                                    ) : (
                                        currentPlan.reviews === Infinity
                                            ? `${reviews.length} отзывов (безлимит)`
                                            : `${reviews.length} из ${currentPlan.reviews} отзывов`
                                    )}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/pricing')}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            >
                                Изменить тариф
                            </Button>
                        </div>

                        {currentPlan.reviews !== Infinity && (
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                        usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{width: `${usagePercentage}%`}}
                                ></div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Всего отзывов</p>
                                    <p className="text-2xl font-bold text-white">
                                        {loading ? (
                                            <Skeleton
                                                width={50}
                                                height={30}
                                                baseColor="#2d2d2d"
                                                highlightColor="#3d3d3d"
                                                style={{display: 'inline-block'}} // чтобы не растягивался
                                            />
                                        ) : (
                                            reviews.length
                                        )}
                                    </p>
                                </div>
                                <MessageSquare className="w-8 h-8 text-gray-500"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Средний рейтинг</p>
                                    <p className="text-2xl font-bold text-white">
                                        {loading ? (
                                            <Skeleton
                                                width={50}
                                                height={30}
                                                baseColor="#2d2d2d"
                                                highlightColor="#3d3d3d"
                                                style={{display: 'inline-block'}}
                                            />
                                        ) : (
                                            averageRating
                                        )}
                                    </p>
                                </div>
                                <Star className="w-8 h-8 text-yellow-500"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">5-звездочных</p>
                                    <p className="text-2xl font-bold text-white">
                                        {loading ? (
                                            <Skeleton
                                                width={50}
                                                height={30}
                                                baseColor="#2d2d2d"
                                                highlightColor="#3d3d3d"
                                                style={{display: 'inline-block'}}
                                            />
                                        ) : (
                                            reviews.filter(r => r.rating === 5).length
                                        )}
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-500"/>
                            </div>
                    </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">С медиа</p>
                                    <p className="text-2xl font-bold text-white">
                                        {loading ? (
                                            <Skeleton
                                                width={50}
                                                height={30}
                                                baseColor="#2d2d2d"
                                                highlightColor="#3d3d3d"
                                                style={{display: 'inline-block'}}
                                            />
                                        ) : (
                                            reviews.filter(r => r.media && r.media.length > 0).length
                                        )}
                                    </p>
                                </div>
                                <Eye className="w-8 h-8 text-blue-500"/>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Links Section */}
                    <div className="lg:col-span-1">
                        <Card className="mb-6 bg-gray-900 border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center text-white">
                                    <Users className="w-5 h-5 mr-2"/>
                                    Ваши ссылки
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Review Link */}
                                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-white">Ссылка для отзывов</h4>
                                        <Badge variant="secondary"
                                               className="bg-green-900 text-green-300">Активна</Badge>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3 break-all font-mono bg-gray-700 p-2 rounded">
                                        {reviewUrl}
                                    </p>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() => copyToClipboard(reviewUrl, 'Ссылка для отзывов скопирована!')}
                                            className="flex-1 bg-gray-700 hover:bg-gray-600"
                                        >
                                            <Copy className="w-4 h-4 mr-2"/>
                                            Копировать
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.open(reviewUrl, '_blank')}
                                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                        >
                                            <ExternalLink className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>

                                {/* Public Page Link */}
                                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-white">Публичная страница</h4>
                                        <Badge variant="secondary"
                                               className="bg-blue-900 text-blue-300">Доступна</Badge>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3 break-all font-mono bg-gray-700 p-2 rounded">
                                        {publicUrl}
                                    </p>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() => copyToClipboard(publicUrl, 'Ссылка на публичную страницу скопирована!')}
                                            className="flex-1 bg-gray-700 hover:bg-gray-600"
                                        >
                                            <Copy className="w-4 h-4 mr-2"/>
                                            Копировать
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.open(publicUrl, '_blank')}
                                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                        >
                                            <ExternalLink className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500 bg-gray-800 p-3 rounded border border-gray-700">
                                    <strong className="text-gray-400">Как использовать:</strong><br/>
                                    • Отправляйте ссылку для отзывов покупателям<br/>
                                    • Делитесь публичной страницей в Instagram<br/>
                                    • Используйте публичную ссылку в био профиля
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Reviews Section */}
                    <div className="lg:col-span-2">
                        <Card className="bg-gray-900 border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-white">
                                    <div className="flex items-center">
                                        <Star className="w-5 h-5 mr-2"/>
                                        Последние отзывы
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(publicUrl, '_blank')}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                    >
                                        <Eye className="w-4 h-4 mr-2"/>
                                        Посмотреть все
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {reviews.length === 0 && !loading ? (
                                    <div className="text-center py-12">
                                        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4"/>
                                        <p className="text-gray-400 mb-4">Пока нет отзывов</p>
                                        <p className="text-sm text-gray-500">
                                            Поделитесь ссылкой с клиентами, чтобы получить первые отзывы
                                        </p>
                                    </div>
                                ) : loading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, index) => (
                                            <div key={index} className="border border-gray-700 rounded-lg p-4">
                                                <div className="flex items-start space-x-3">
                                                    <Skeleton
                                                        circle
                                                        width={40}
                                                        height={40}
                                                        baseColor="#2d2d2d"
                                                        highlightColor="#3d3d3d"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <Skeleton
                                                                    width={120}
                                                                    height={20}
                                                                    baseColor="#2d2d2d"
                                                                    highlightColor="#3d3d3d"
                                                                    style={{marginBottom: '8px'}}
                                                                />
                                                                <Skeleton
                                                                    width={80}
                                                                    height={16}
                                                                    baseColor="#2d2d2d"
                                                                    highlightColor="#3d3d3d"
                                                                />
                                                            </div>
                                                            <Skeleton
                                                                width={100}
                                                                height={16}
                                                                baseColor="#2d2d2d"
                                                                highlightColor="#3d3d3d"
                                                            />
                                                        </div>
                                                        <Skeleton
                                                            count={2}
                                                            baseColor="#2d2d2d"
                                                            highlightColor="#3d3d3d"
                                                            style={{marginBottom: '12px'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.slice(0, 5).map((review, index) => (
                                            <div key={index}
                                                 className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
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
                                        ))}
                                        {reviews.length > 5 && (
                                            <div className="text-center pt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => window.open(publicUrl, '_blank')}
                                                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                                >
                                                    Посмотреть все {reviews.length} отзывов
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;