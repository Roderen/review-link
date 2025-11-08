import {Link, Users, Star} from 'lucide-react';
import {StepCard} from './StepCard';
import {FeaturePreviewCard} from './FeaturePreviewCard';

export const HowItWorksSection = () => {
    return (
        <section className="py-16 px-4 bg-gray-900/30">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-white">Как это работает</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Простой процесс в три шага для сбора и отображения отзывов
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <StepCard
                        icon={Link}
                        step="1"
                        title="Получите ссылку"
                        description="После регистрации вы получите персональную ссылку для отзывов"
                    />
                    <StepCard
                        icon={Users}
                        step="2"
                        title="Делитесь с клиентами"
                        description="Отправляйте ссылку покупателям для оставления отзывов"
                    />
                    <StepCard
                        icon={Star}
                        step="3"
                        title="Собирайте отзывы"
                        description="Все отзывы собираются на красивой публичной странице"
                    />
                </div>

                {/* Preview Cards */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <FeaturePreviewCard type="review-form"/>
                    <FeaturePreviewCard type="public-page"/>
                </div>
            </div>
        </section>
    );
};
