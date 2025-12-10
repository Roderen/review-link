import { useEffect, useState } from 'react';
import { getShopById } from '@/lib/firebase/services/shops';

/**
 * Custom hook для загрузки данных магазина
 * @param shopId - ID магазина
 * @returns Данные магазина, статус загрузки и флаг "не найден"
 */
export const useShopData = (shopId: string | undefined) => {
    const [shop, setShop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [shopNotFound, setShopNotFound] = useState(false);

    useEffect(() => {
        if (!shopId) {
            setLoading(false);
            return;
        }

        const loadShop = async () => {
            try {
                setLoading(true);
                const shopData = await getShopById(shopId);
                setShop(shopData);
                setShopNotFound(false);
                // Устанавливаем loading в false только после установки данных
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки магазина:', error);
                setShopNotFound(true);
                setLoading(false);
            }
        };

        loadShop();
    }, [shopId]);

    return { shop, loading, shopNotFound };
};
