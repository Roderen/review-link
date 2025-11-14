import { useState, useMemo } from 'react';

interface FormData {
    rating: number;
    name: string;
    reviewText: string;
}

/**
 * Custom hook для валидации формы отзыва
 * @returns Состояние формы, сеттеры и статус валидации
 */
export const useFormValidation = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState('');
    const [reviewText, setReviewText] = useState('');

    /**
     * Вычисляет, валидна ли форма
     */
    const isValid = useMemo(() => {
        return rating > 0 && name.trim().length > 0 && reviewText.trim().length > 0;
    }, [rating, name, reviewText]);

    /**
     * Проверяет, заполнено ли конкретное поле
     */
    const fieldErrors = useMemo(() => ({
        rating: rating === 0,
        name: name.trim().length === 0,
        reviewText: reviewText.trim().length === 0,
    }), [rating, name, reviewText]);

    /**
     * Сбрасывает все поля формы
     */
    const resetForm = () => {
        setRating(0);
        setHoverRating(0);
        setName('');
        setReviewText('');
    };

    /**
     * Получает данные формы для отправки
     */
    const getFormData = (): FormData => ({
        rating,
        name: name.trim(),
        reviewText: reviewText.trim(),
    });

    return {
        // Значения полей
        rating,
        hoverRating,
        name,
        reviewText,

        // Сеттеры
        setRating,
        setHoverRating,
        setName,
        setReviewText,

        // Валидация
        isValid,
        fieldErrors,

        // Утилиты
        resetForm,
        getFormData,
    };
};
