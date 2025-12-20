import {Link, Users, Star} from 'lucide-react';
import {StepCard} from './StepCard';
import {FeaturePreviewCard} from './FeaturePreviewCard';

export const HowItWorksSection = () => {
    return (
        <section className="py-16 px-4 bg-gray-900/30">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-white">Як це працює?</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <StepCard
                        icon={Link}
                        step="1"
                        title="Отримайте посилання"
                        description="Після реєстрації в особистому кабінеті ви отримаєте персональне посилання для збору відгуків"
                    />
                    <StepCard
                        icon={Users}
                        step="2"
                        title="Діліться з клієнтами"
                        description="Надсилайте посилання покупцям для залишення відгуків (кожне посилання унікальне і не може використоватись більше одного разу)"
                    />
                    <StepCard
                        icon={Star}
                        step="3"
                        title="Публічна сторінка"
                        description="Всі відгуки збираються на публічній сторінці - посилання можна вставити в біо"
                    />
                </div>

                {/* Preview Cards */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <FeaturePreviewCard
                        title="Форма відгуку"
                        description=""
                        imageUrl="/src/images/review-form.png"
                        imageAlt="Скриншот формы для оставления отзыва"
                    />
                    <FeaturePreviewCard
                        title="Публічна сторінка"
                        description=""
                        imageUrl="/src/images/review-page.png"
                        imageAlt="Скриншот публичной страницы с отзывами"
                    />
                </div>
            </div>
        </section>
    );
};
