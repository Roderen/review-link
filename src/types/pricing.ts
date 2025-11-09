export interface PlanFeature {
    name: string;
    price: string;
    period: string;
    features: string[];
    popular: boolean;
    buttonText: string;
    buttonVariant: 'default' | 'outline';
}

export interface FAQItem {
    question: string;
    answer: string;
}
