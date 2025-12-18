import {Zap, Shield, MessageSquare} from 'lucide-react';
import {BenefitCard} from './BenefitCard';

export const BenefitsSection = () => {
    return (
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-12 text-white">Чому ми?</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <BenefitCard
                        icon={Shield}
                        title="Безпечно"
                        description="Лише власник може сгенерувати посилання та надіслати його покупцю"
                    />
                    <BenefitCard
                        icon={Zap}
                        title="Довіра"
                        description="Підвищуйте довіру клієнтів за допомогою реальних відгуків"
                    />
                    <BenefitCard
                        icon={MessageSquare}
                        title="Практично"
                        description="Усі відгуки зберігаються на персональній сторінці, яку можна вставити в біо"
                    />
                </div>
            </div>
        </section>
    );
};
