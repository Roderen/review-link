import {FAQItem} from './FAQItem';
import {FAQItem as FAQItemType} from '@/types/pricing';

const faqData: FAQItemType[] = [
    {
        question: 'Чи можна змінити тариф?',
        answer: 'Так, ви можете підвищити або знизити тариф у будь-який час.'
    },
    {
        question: 'Що відбувається при перевищенні ліміту?',
        answer: 'При досягненні ліміту відгуків нові відгуки тимчасово не приймаються. Ви отримаєте повідомлення з пропозицією підвищити тариф.'
    },
    {
        question: 'Чи є знижки при річній оплаті?',
        answer: 'Так, при оплаті за рік ви отримуєте знижку 20% на всі платні тарифи.'
    },
    {
        question: 'Яка підтримка надається?',
        answer: 'Email підтримка для тарифу «Про», пріоритетна підтримка для тарифу «Бізнес».'
    },
    {
        question: 'Чи в безпеці мої дані?',
        answer: 'Всі дані шифруються і зберігаються відповідно до стандартів безпеки. Ми не передаємо дані третім особам.'
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
                    FAQ
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
