export interface DashboardReview {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    text: string;
    date: Date;
    media?: string[];
}

export interface PlanLimits {
    reviews: number;
    name: string;
}

export interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    loading?: boolean;
}
