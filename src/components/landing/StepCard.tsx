import {Card, CardContent} from '@/components/ui/card';
import {LucideIcon} from 'lucide-react';

interface StepCardProps {
    icon: LucideIcon;
    step: string;
    title: string;
    description: string;
}

export const StepCard = ({icon: Icon, step, title, description}: StepCardProps) => {
    return (
        <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
                <div
                    className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-gray-300"/>
                </div>
                <h3 className="font-semibold mb-2 text-white">{step}. {title}</h3>
                <p className="text-gray-400 text-sm">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
};
