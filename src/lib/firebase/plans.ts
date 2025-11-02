export interface PlanConfig {
    name: string;
    maxReviews: number;
}

export interface Plans {
    free: PlanConfig;
    pro: PlanConfig;
    enterprise: PlanConfig;
}

export const PLANS: Plans = {
    free: {
        name: 'Бесплатный',
        maxReviews: 10,
    },
    pro: {
        name: 'Профессиональный',
        maxReviews: 100,
    },
    enterprise: {
        name: 'Бизнес',
        maxReviews: Infinity,
    },
};
