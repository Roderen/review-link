import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Instagram, Star, Users, Link, Image, Video, Shield, Zap, MessageSquare, Check} from 'lucide-react';
import {useAuth} from '@/contexts/AuthContext.tsx';
import {toast} from 'sonner';
import {signInWithGoogle} from "@/lib/firebase/auth.ts";

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        } else {
            setIsLoading(false);
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            // убрать navigate('/dashboard') отсюда
        } catch (error) {
            console.error('❌ Ошибка входа:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div
                            className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white"/>
                        </div>
                        <span className="text-xl font-bold text-white">
              ReviewLink
            </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/pricing')}
                            className="text-gray-300 hover:text-white"
                        >
                            Тарифы
                        </Button>
                        <Button onClick={handleGoogleLogin} disabled={isLoading}
                                className="bg-white text-gray-900 hover:bg-gray-100">
                            {isLoading ? 'Входим...' : 'Войти'}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                    <Badge variant="secondary" className="mb-6 px-4 py-2 bg-gray-800 text-gray-300 border-gray-700">
                        <Instagram className="w-4 h-4 mr-2"/>
                        Для Instagram магазинов
                    </Badge>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                        Красивые отзывы о вашем магазине — по одной ссылке
                    </h1>

                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Без скринов, без сторис. Просто делитесь ссылкой — и собирайте реальные отзывы от клиентов.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 transition-all"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor"
                                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor"
                                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor"
                                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            {isLoading ? 'Входим через Google...' : 'Войти через Google'}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/pricing')}
                            className="text-lg px-8 py-6 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            Посмотреть тарифы
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Preview */}
            <section className="py-16 px-4 bg-gray-900/30">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-white">Как это работает</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Простой процесс в три шага для сбора и отображения отзывов
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
                            <CardContent className="pt-6">
                                <div
                                    className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Link className="w-6 h-6 text-gray-300"/>
                                </div>
                                <h3 className="font-semibold mb-2 text-white">1. Получите ссылку</h3>
                                <p className="text-gray-400 text-sm">
                                    После регистрации вы получите персональную ссылку для отзывов
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
                            <CardContent className="pt-6">
                                <div
                                    className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-6 h-6 text-gray-300"/>
                                </div>
                                <h3 className="font-semibold mb-2 text-white">2. Делитесь с клиентами</h3>
                                <p className="text-gray-400 text-sm">
                                    Отправляйте ссылку покупателям для оставления отзывов
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
                            <CardContent className="pt-6">
                                <div
                                    className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-6 h-6 text-gray-300"/>
                                </div>
                                <h3 className="font-semibold mb-2 text-white">3. Собирайте отзывы</h3>
                                <p className="text-gray-400 text-sm">
                                    Все отзывы собираются на красивой публичной странице
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Cards */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Форма отзыва</h3>
                            <p className="text-gray-400 mb-6">
                                Ваши клиенты легко оставляют отзывы с фото и видео
                            </p>
                            <Card className="p-6 bg-gray-800 border-gray-700 shadow-lg">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                                        <div>
                                            <div className="font-medium text-white">Мария Петрова</div>
                                            <div className="text-sm text-gray-400">Покупатель</div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>
                                        ))}
                                    </div>
                                    <p className="text-gray-300">
                                        Отличное качество! Платье пришло точно как на фото...
                                    </p>
                                    <div className="flex space-x-2">
                                        <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                                            <Image className="w-6 h-6 text-gray-400"/>
                                        </div>
                                        <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                                            <Video className="w-6 h-6 text-gray-400"/>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Публичная страница</h3>
                            <p className="text-gray-400 mb-6">
                                Красивая витрина всех ваших отзывов для демонстрации клиентам
                            </p>
                            <Card className="p-6 bg-gray-800 border-gray-700 shadow-lg">
                                <div className="text-center mb-4">
                                    <h4 className="text-lg font-semibold text-white">Anna Boutique</h4>
                                    <div className="flex items-center justify-center space-x-2 mt-2">
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-400">(24 отзыва)</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((review) => (
                                        <div key={review} className="border-l-4 border-gray-600 pl-4 py-2">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                                                <span
                                                    className="text-sm font-medium text-white">Покупатель {review}</span>
                                            </div>
                                            <div className="flex space-x-1 mb-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star}
                                                          className="w-3 h-3 fill-yellow-400 text-yellow-400"/>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-400">Отличный товар, рекомендую!</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-12 text-white">Почему ReviewLink?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <div
                                className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                                <Zap className="w-6 h-6 text-gray-300"/>
                            </div>
                            <h3 className="font-semibold text-white">Быстро</h3>
                            <p className="text-gray-400 text-sm">
                                Регистрация за 30 секунд, получение отзывов сразу после запуска
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                                <Shield className="w-6 h-6 text-gray-300"/>
                            </div>
                            <h3 className="font-semibold text-white">Безопасно</h3>
                            <p className="text-gray-400 text-sm">
                                Только владелец может генерировать ссылки, полный контроль отзывов
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare className="w-6 h-6 text-gray-300"/>
                            </div>
                            <h3 className="font-semibold text-white">Профессионально</h3>
                            <p className="text-gray-400 text-sm">
                                Современный дизайн, который украсит ваш Instagram профиль
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-16 px-4 bg-gray-900/30">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-3xl font-bold mb-4 text-white">
                        Начните бесплатно
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Выберите тариф, который подходит вашему бизнесу
                    </p>

                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        {[
                            {name: 'Бесплатный', price: '0₽', reviews: '10 отзывов'},
                            {name: 'Стартер', price: '5$', reviews: '100 отзывов'},
                            {name: 'Бизнес', price: '12$', reviews: '500 отзывов'},
                            {name: 'Про', price: '20$', reviews: 'Безлимит'}
                        ].map((plan, index) => (
                            <Card key={index}
                                  className="p-4 bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                                <CardContent className="pt-4 text-center">
                                    <h3 className="font-semibold text-white mb-2">{plan.name}</h3>
                                    <div className="text-2xl font-bold text-white mb-1">{plan.price}</div>
                                    <p className="text-sm text-gray-400">{plan.reviews}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Button
                        size="lg"
                        onClick={() => navigate('/pricing')}
                        className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100"
                    >
                        Посмотреть все тарифы
                    </Button>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gray-800">
                <div className="container mx-auto text-center max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4 text-white">
                        Начните собирать отзывы уже сегодня
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Присоединяйтесь к сотням магазинов, которые уже используют ReviewLink
                    </p>
                    <Button
                        size="lg"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform"
                    >
                        {isLoading ? 'Входим...' : 'Создать аккаунт бесплатно'}
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
                <div className="container mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div
                            className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white"/>
                        </div>
                        <span className="text-xl font-bold text-white">
              ReviewLink
            </span>
                    </div>

                    <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-6">
                        <a href="#" className="hover:text-white transition-colors">support@reviewlink.com</a>
                        <a href="#" className="hover:text-white transition-colors">Пользовательское соглашение</a>
                        <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                    </div>

                    <p className="text-xs text-gray-500">
                        © 2025 ReviewLink. Сделано с ❤️ для Instagram предпринимателей.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;