import {LucideIcon} from 'lucide-react';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export const BenefitCard = ({icon: Icon, title, description}: BenefitCardProps) => {
    return (
        <div className="space-y-4">
            <div
                className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-gray-300"/>
            </div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">
                {description}
            </p>
        </div>
    );
};
