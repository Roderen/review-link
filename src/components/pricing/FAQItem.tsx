import {FAQItem as FAQItemType} from '@/types/pricing';

interface FAQItemProps {
    item: FAQItemType;
}

export const FAQItem = ({item}: FAQItemProps) => {
    return (
        <div>
            <h3 className="font-semibold text-white mb-2">{item.question}</h3>
            <p className="text-gray-400 text-sm">
                {item.answer}
            </p>
        </div>
    );
};
