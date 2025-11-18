import {Card} from '@/components/ui/card';

interface FeaturePreviewCardProps {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt?: string;
}

export const FeaturePreviewCard = ({title, description, imageUrl, imageAlt}: FeaturePreviewCardProps) => {
    return (
        <div>
            <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
            <p className="text-gray-400 mb-6">
                {description}
            </p>
            <Card className="p-4 bg-gray-800 border-gray-700 shadow-lg overflow-hidden">
                <img
                    src={imageUrl}
                    alt={imageAlt || title}
                    className="w-full h-auto rounded-lg"
                />
            </Card>
        </div>
    );
};
