import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, MessageSquare, ArrowLeft } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase/auth.ts';

const PricingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // AuthContext will handle navigation after successful login
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      name: 'Бесплатный',
      price: '0₽',
      period: 'навсегда',
      description: 'Для начинающих',
      features: [
        'До 10 отзывов в месяц',
        'Базовая форма отзывов',
        'Публичная страница',
        'Загрузка фото (до 3 на отзыв)',
        'Email поддержка'
      ],
      popular: false,
      buttonText: 'Начать бесплатно',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Стартер',
      price: '5$',
      period: 'в месяц',
      description: 'Для малого бизнеса',
      features: [
        'До 100 отзывов в месяц',
        'Расширенная форма отзывов',
        'Кастомизация страницы',
        'Загрузка фото и видео (до 5 на отзыв)',
        'Базовая аналитика',
        'Приоритетная поддержка'
      ],
      popular: true,
      buttonText: 'Выбрать план',
      buttonVariant: 'default' as const
    },
    {
      name: 'Бизнес',
      price: '12$',
      period: 'в месяц',
      description: 'Для растущего бизнеса',
      features: [
        'До 500 отзывов в месяц',
        'Полная кастомизация',
        'Расширенная аналитика',
        'Экспорт данных',
        'Интеграция с соцсетями',
        'Модерация отзывов',
        'Приоритетная поддержка'
      ],
      popular: false,
      buttonText: 'Выбрать план',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Про',
      price: '20$',
      period: 'в месяц',
      description: 'Для крупного бизнеса',
      features: [
        'Безлимитные отзывы',
        'Белый лейбл',
        'API доступ',
        'Продвинутая аналитика',
        'Мультиязычность',
        'Персональный менеджер',
        'SLA 99.9%'
      ],
      popular: false,
      buttonText: 'Связаться с нами',
      buttonVariant: 'outline' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                ReviewLink
              </span>
            </div>
          </div>
          <Button onClick={handleGoogleLogin} disabled={isLoading} className="bg-white text-gray-900 hover:bg-gray-100">
            {isLoading ? 'Входим...' : 'Войти'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Выберите подходящий тариф
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Начните бесплатно и масштабируйтесь по мере роста вашего бизнеса
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-6 transition-all hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gray-800 border-gray-600 shadow-xl' 
                    : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-900">
                    Популярный
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white text-xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-white text-gray-900 hover:bg-gray-100' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    variant={plan.buttonVariant}
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Часто задаваемые вопросы
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Можно ли сменить тариф?</h3>
                <p className="text-gray-400 text-sm">
                  Да, вы можете повысить или понизить тариф в любое время. 
                  Изменения вступают в силу с начала следующего расчетного периода.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Что происходит при превышении лимита?</h3>
                <p className="text-gray-400 text-sm">
                  При достижении лимита отзывов новые отзывы временно не принимаются. 
                  Вы получите уведомление с предложением повысить тариф.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Есть ли скидки при годовой оплате?</h3>
                <p className="text-gray-400 text-sm">
                  Да, при оплате за год вы получаете скидку 20% на все платные тарифы.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Можно ли экспортировать отзывы?</h3>
                <p className="text-gray-400 text-sm">
                  Экспорт отзывов доступен начиная с тарифа "Бизнес". 
                  Вы можете выгрузить данные в форматах CSV и JSON.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Какая поддержка предоставляется?</h3>
                <p className="text-gray-400 text-sm">
                  Email поддержка для всех тарифов. Приоритетная поддержка 
                  и персональный менеджер для тарифов "Стартер" и выше.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Безопасны ли мои данные?</h3>
                <p className="text-gray-400 text-sm">
                  Все данные шифруются и хранятся в соответствии с международными 
                  стандартами безопасности. Мы не передаем данные третьим лицам.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Готовы начать?
          </h2>
          <p className="text-gray-400 mb-8">
            Создайте аккаунт за 30 секунд и начните собирать отзывы уже сегодня
          </p>
          <Button 
            size="lg" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100"
          >
            {isLoading ? 'Входим...' : 'Начать бесплатно'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
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

export default PricingPage;