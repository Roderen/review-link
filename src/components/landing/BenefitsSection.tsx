import {Zap, Shield, MessageSquare} from 'lucide-react';
import {BenefitCard} from './BenefitCard';

export const BenefitsSection = () => {
    return (
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-12 text-white">Почему ReviewLink?</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <BenefitCard
                        icon={Zap}
                        title="Быстро"
                        description="Регистрация за 30 секунд, получение отзывов сразу после запуска"
                    />
                    <BenefitCard
                        icon={Shield}
                        title="Безопасно"
                        description="Только владелец может генерировать ссылки, полный контроль отзывов"
                    />
                    <BenefitCard
                        icon={MessageSquare}
                        title="Профессионально"
                        description="Современный дизайн, который украсит ваш Instagram профиль"
                    />
                </div>
            </div>
        </section>
    );
};
