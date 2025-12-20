import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';

interface ReviewFormFieldsProps {
    name: string;
    reviewText: string;
    onNameChange: (name: string) => void;
    onReviewTextChange: (text: string) => void;
}

export const ReviewFormFields = ({name, reviewText, onNameChange, onReviewTextChange}: ReviewFormFieldsProps) => {
    return (
        <>
            {/* Name */}
            <div>
                <Label htmlFor="name" className="text-base font-medium text-white">Ваше ім'я *</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Ваше імʼя"
                    className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
            </div>

            {/* Review Text */}
            <div>
                <Label htmlFor="review" className="text-base font-medium text-white">Ваш отзыв *</Label>
                <Textarea
                    id="review"
                    value={reviewText}
                    onChange={(e) => onReviewTextChange(e.target.value)}
                    placeholder="Розкажіть про свій досвід покупки. Що вам сподобалося? Якість товару, доставка, спілкування з продавцем..."
                    className="mt-2 min-h-32 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
            </div>
        </>
    );
};
