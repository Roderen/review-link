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
        console.log('🔍 [useShopData] useEffect triggered, shopId:', shopId);

        if (!shopId) {
            console.log('❌ [useShopData] No shopId, setting loading to false');
            setLoading(false);
            return;
        }

        const loadShop = async () => {
            try {
                console.log('🔄 [useShopData] Starting to load shop...');
                setLoading(true);

                console.log('📡 [useShopData] Calling getShopById...');
                const shopData = await getShopById(shopId);

                console.log('✅ [useShopData] Shop data received:', shopData);
                setShop(shopData);
                setShopNotFound(false);
                setLoading(false);
                console.log('✅ [useShopData] Loading set to false');
            } catch (error) {
                console.error('❌ [useShopData] Error loading shop:', error);
                console.error('❌ [useShopData] Error details:', {
                    message: error.message,
                    code: error.code,
                    name: error.name
                });
                setShopNotFound(true);
                setLoading(false);
                console.log('✅ [useShopData] Loading set to false (after error)');
            }
        };

        loadShop();
    }, [shopId]);

    console.log('🔍 [useShopData] Current state:', { shop: !!shop, loading, shopNotFound });

    return { shop, loading, shopNotFound };
};