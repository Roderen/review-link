import {Card, CardContent} from '@/components/ui/card';
import {MessageSquare} from 'lucide-react';

interface EmptyStateProps {
    filterRating: number | null;
}

export const EmptyState = ({filterRating}: EmptyStateProps) => {
    return (
        <Card className="bg-gray-900 border-gray-700">
            <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4"/>
                <p className="text-gray-400">
                    {filterRating
                        ? `Нет отзывов с оценкой ${filterRating} звезд`
                        : 'Пока нет отзывов'
                    }
                </p>
            </CardContent>
        </Card>
    );
};
