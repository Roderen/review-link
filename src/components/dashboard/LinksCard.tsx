import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Users, Copy, ExternalLink, RefreshCw} from 'lucide-react';

interface LinksCardProps {
    reviewUrl: string;
    publicUrl: string;
    onCopy: (text: string, message: string) => void;
    onGenerateNewLink: () => void;
}

export const LinksCard = ({reviewUrl, publicUrl, onCopy, onGenerateNewLink}: LinksCardProps) => {
    return (
        <Card className="mb-6 bg-gray-900 border-gray-700">
            <CardHeader>
                <CardTitle className="flex items-center text-white">
                    <Users className="w-5 h-5 mr-2"/>
                    Ваши ссылки
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Review Link */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Ссылка для отзывов</h4>
                        <Badge variant="secondary"
                               className="bg-green-900 text-green-300">Одноразовая</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 break-all font-mono bg-gray-700 p-2 rounded">
                        {reviewUrl}
                    </p>
                    <div className="flex space-x-2 mb-2">
                        <Button
                            size="sm"
                            onClick={() => onCopy(reviewUrl, 'Ссылка для отзывов скопирована!')}
                            className="flex-1 bg-gray-700 hover:bg-gray-600"
                        >
                            <Copy className="w-4 h-4 mr-2"/>
                            Копировать
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(reviewUrl, '_blank')}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                            <ExternalLink className="w-4 h-4"/>
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onGenerateNewLink}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        <RefreshCw className="w-4 h-4 mr-2"/>
                        Создать новую ссылку
                    </Button>
                </div>

                {/* Public Page Link */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Публичная страница</h4>
                        <Badge variant="secondary"
                               className="bg-blue-900 text-blue-300">Доступна</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 break-all font-mono bg-gray-700 p-2 rounded">
                        {publicUrl}
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            onClick={() => onCopy(publicUrl, 'Ссылка на публичную страницу скопирована!')}
                            className="flex-1 bg-gray-700 hover:bg-gray-600"
                        >
                            <Copy className="w-4 h-4 mr-2"/>
                            Копировать
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
                    <strong className="text-gray-400">Как использовать:</strong><br/>
                    • Ссылка для отзывов <strong className="text-yellow-400">одноразовая</strong> - создавайте новую для каждого клиента<br/>
                    • После отправки отзыва ссылка становится неактивной<br/>
                    • Делитесь публичной страницей в Instagram<br/>
                    • Используйте публичную ссылку в био профиля
                </div>
            </CardContent>
        </Card>
    );
};
