import {Button} from '@/components/ui/button';
import {MessageSquare} from 'lucide-react';

interface SubmitButtonProps {
    isSubmitting: boolean;
    disabled: boolean;
}

export const SubmitButton = ({isSubmitting, disabled}: SubmitButtonProps) => {
    return (
        <Button
            type="submit"
            className="w-full text-lg py-6 bg-gray-700 hover:bg-gray-600"
            disabled={disabled}
        >
            {isSubmitting ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Отправляем отзыв...
                </>
            ) : (
                <>
                    <MessageSquare className="w-5 h-5 mr-2"/>
                    Отправить отзыв
                </>
            )}
        </Button>
    );
};
