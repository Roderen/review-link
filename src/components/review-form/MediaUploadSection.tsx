import {Label} from '@/components/ui/label';
import {Camera, Upload, X} from 'lucide-react';

interface MediaUploadSectionProps {
    media: string[];
    isUploading: boolean;
    onMediaUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveMedia: (index: number) => void;
}

export const MediaUploadSection = ({media, isUploading, onMediaUpload, onRemoveMedia}: MediaUploadSectionProps) => {
    // Проверяет, является ли URL видео-файлом
    const isVideo = (url: string) => {
        return url.includes('/video/') || /\.(mp4|webm|ogg|mov)$/i.test(url);
    };

    return (
        <div>
            <Label className="text-base font-medium text-white">Фото (необязательно)</Label>
            <p className="text-sm text-gray-400 mb-3">
                Добавьте фото товара, чтобы помочь другим покупателям
            </p>

            {media.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-3">
                    {media.map((url, index) => (
                        <div key={index} className="relative group">
                            {isVideo(url) ? (
                                <video
                                    src={url}
                                    className="w-full h-24 object-cover rounded-lg"
                                    controls
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={url}
                                    alt={`Media ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => onRemoveMedia(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {media.length < 5 && (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                    <input
                        type="file"
                        id="media"
                        multiple
                        accept="image/*"
                        onChange={onMediaUpload}
                        className="hidden"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="media"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                        <div className="flex items-center space-x-2 text-gray-500">
                            <Camera className="w-6 h-6"/>
                            <Upload className="w-6 h-6"/>
                        </div>
                        <span className="text-gray-400">
                            {isUploading ? 'Загрузка...' : 'Нажмите для загрузки фото'}
                        </span>
                        <span className="text-xs text-gray-500">
                            Максимум 5 файлов, до 30 МБ каждый
                        </span>
                        <span className="text-xs text-gray-600">
                            JPG, PNG, GIF, WebP
                        </span>
                        <span className="text-xs text-gray-500 italic">
                            Видео временно недоступно
                        </span>
                    </label>
                </div>
            )}
        </div>
    );
};
