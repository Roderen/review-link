import {FAQItem} from './FAQItem';
import {FAQItem as FAQItemType} from '@/types/pricing';

const faqData: FAQItemType[] = [
    {
        question: 'Можно ли сменить тариф?',
        answer: 'Да, вы можете повысить или понизить тариф в любое время. Изменения вступают в силу с начала следующего расчетного периода.'
    },
    {
        question: 'Что происходит при превышении лимита?',
        answer: 'При достижении лимита отзывов новые отзывы временно не принимаются. Вы получите уведомление с предложением повысить тариф.'
    },
    {
        question: 'Есть ли скидки при годовой оплате?',
        answer: 'Да, при оплате за год вы получаете скидку 20% на все платные тарифы.'
    },
    {
        question: 'Можно ли экспортировать отзывы?',
        answer: 'Экспорт отзывов доступен начиная с тарифа "Бизнес". Вы можете выгрузить данные в форматах CSV и JSON.'
    },
    {
        question: 'Какая поддержка предоставляется?',
        answer: 'Email поддержка для всех тарифов. Приоритетная поддержка и персональный менеджер для тарифов "Стартер" и выше.'
    },
    {
        question: 'Безопасны ли мои данные?',
        answer: 'Все данные шифруются и хранятся в соответствии с международными стандартами безопасности. Мы не передаем данные третьим лицам.'
    }
];

export const FAQSection = () => {
    const midPoint = Math.ceil(faqData.length / 2);
    const leftColumn = faqData.slice(0, midPoint);
    const rightColumn = faqData.slice(midPoint);

    return (
        <section className="py-16 px-4 bg-gray-900/30">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-3xl font-bold text-center mb-12 text-white">
                    Часто задаваемые вопросы
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {leftColumn.map((item, index) => (
                            <FAQItem key={index} item={item}/>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {rightColumn.map((item, index) => (
                            <FAQItem key={index} item={item}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
