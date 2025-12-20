import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Users, Copy, ExternalLink} from 'lucide-react';

interface LinksCardProps {
    reviewUrl: string;
    publicUrl: string;
    onCopy: (text: string, message: string) => void;
    onGenerateNewLink: () => void;
}

export const LinksCard = ({reviewUrl, publicUrl, onCopy, onGenerateNewLink}: LinksCardProps) => {
    // Обработчик копирования с автогенерацией новой ссылки
    const handleCopyReviewLink = () => {
        onCopy(reviewUrl, 'Ссылка для отзывов скопирована!');
        // Автоматически генерируем новую ссылку после копирования
        onGenerateNewLink();
    };

    // Обработчик открытия ссылки с автогенерацией новой
    const handleOpenReviewLink = () => {
        window.open(reviewUrl, '_blank');
        // Автоматически генерируем новую ссылку после открытия
        onGenerateNewLink();
    };

    return (
        <Card className="mb-6 bg-gray-900 border-gray-700">
            <CardHeader>
                <CardTitle className="flex items-center text-white">
                    <Users className="w-5 h-5 mr-2"/>
                    Ваші посилання
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Review Link */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Посилання для відгуків</h4>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 break-all font-mono bg-gray-700 p-2 rounded">
                        {reviewUrl}
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            onClick={handleCopyReviewLink}
                            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white"
                        >
                            <Copy className="w-4 h-4 mr-2 text-white"/>
                            Копіювати
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleOpenReviewLink}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            <ExternalLink className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>

                {/* Public Page Link */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Публічна сторінка</h4>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 break-all font-mono bg-gray-700 p-2 rounded">
                        {publicUrl}
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            onClick={() => onCopy(publicUrl, 'Ссылка на публичную страницу скопирована!')}
                            className="flex-1 bg-blue-700 hover:bg-blue-600 text-white"
                        >
                            <Copy className="w-4 h-4 mr-2 text-white"/>
                            Копіювати
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(publicUrl, '_blank')}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            <ExternalLink className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>

                <div className="text-xs text-gray-500 bg-gray-800 p-3 rounded border border-gray-700">
                    <strong className="text-gray-400">Як використовувати:</strong><br/>
                    • Посилання для відгуків <strong className="underline">одноразове</strong><br/>
                    • При копіюванні або відкритті автоматично генерується нове посилання<br/>
                    • Після відправлення відгуку посилання стає неактивним<br/>
                    • Використовуйте публічне посилання в біо Instagram профілю
                </div>
            </CardContent>
        </Card>
    );
};
