export interface PlanConfig {
    name: string;
    maxReviews: number;
}

export interface Plans {
    free: PlanConfig;
    business: PlanConfig;
    pro: PlanConfig;
}

export const PLANS: Plans = {
    free: {
        name: 'Бесплатный',
        maxReviews: 10,
    },
    business: {
        name: 'Профессиональный',
        maxReviews: 500,
    },
    pro: {
        name: 'Бизнес',
        maxReviews: Infinity,
    },
};
