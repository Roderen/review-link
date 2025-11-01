// src/lib/firebase/firestore.ts
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    increment,
    serverTimestamp,
    Timestamp,
    setDoc,
} from 'firebase/firestore';
import {db} from './firebase-config';
import type {User, Review} from './types';

// Collections
const USERS_COLLECTION = 'users';
const REVIEWS_COLLECTION = 'reviews';
const REVIEW_LINKS_COLLECTION = 'review_links';

/**
 * ИНТЕРФЕЙС ДЛЯ ССЫЛОК ОТЗЫВОВ
 */
export interface ReviewLink {
    id: string;
    storeOwnerId: string;
    isActive: boolean;
    usageCount: number;
    maxUsage?: number;
    customMessage?: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}

/**
 * ПОЛЬЗОВАТЕЛИ
 */
export const createUserProfile = async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
        const userDoc = doc(db, USERS_COLLECTION, userData.uid);
        const userWithTimestamps = {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(userDoc, userWithTimestamps);

        return {
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw new Error('Failed to create user profile');
    }
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
    try {
        const userDoc = doc(db, USERS_COLLECTION, uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                uid: docSnap.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                subscription: {
                    ...data.subscription,
                    startDate: data.subscription?.startDate?.toDate() || new Date(),
                    endDate: data.subscription?.endDate?.toDate(),
                    renewalDate: data.subscription?.renewalDate?.toDate(),
                },
            } as User;
        }

        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw new Error('Failed to get user profile');
    }
};

export const updateUserProfile = async (uid: string, updates: Partial<User>): Promise<void> => {
    try {
        const userDoc = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userDoc, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile');
    }
};

/**
 * ССЫЛКИ ДЛЯ ОТЗЫВОВ
 */
export const createReviewLink = async (
    storeOwnerId: string,
    options?: {
        customMessage?: string;
        maxUsage?: number;
        expiresAt?: Date;
    }
): Promise<ReviewLink> => {
    try {
        const linkData = {
            storeOwnerId,
            isActive: true,
            usageCount: 0,
            maxUsage: options?.maxUsage || null,
            customMessage: options?.customMessage || null,
            expiresAt: options?.expiresAt ? Timestamp.fromDate(options.expiresAt) : null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, REVIEW_LINKS_COLLECTION), linkData);

        return {
            id: docRef.id,
            storeOwnerId,
            isActive: true,
            usageCount: 0,
            maxUsage: options?.maxUsage,
            customMessage: options?.customMessage,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: options?.expiresAt,
        };
    } catch (error) {
        console.error('Error creating review link:', error);
        throw new Error('Failed to create review link');
    }
};

export const getReviewLinks = async (storeOwnerId: string): Promise<ReviewLink[]> => {
    try {
        const q = query(
            collection(db, REVIEW_LINKS_COLLECTION),
            where('storeOwnerId', '==', storeOwnerId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const links: ReviewLink[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            links.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                expiresAt: data.expiresAt?.toDate(),
            } as ReviewLink);
        });

        return links;
    } catch (error) {
        console.error('Error getting review links:', error);
        throw new Error('Failed to get review links');
    }
};

export const getReviewLink = async (linkId: string): Promise<ReviewLink | null> => {
    try {
        const linkDoc = await getDoc(doc(db, REVIEW_LINKS_COLLECTION, linkId));

        if (linkDoc.exists()) {
            const data = linkDoc.data();

            // Проверяем не истекла ли ссылка
            if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
                return null;
            }

            // Проверяем не превышен ли лимит использований
            if (data.maxUsage && data.usageCount >= data.maxUsage) {
                return null;
            }

            return {
                ...data,
                id: linkDoc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                expiresAt: data.expiresAt?.toDate(),
            } as ReviewLink;
        }

        return null;
    } catch (error) {
        console.error('Error getting review link:', error);
        throw new Error('Failed to get review link');
    }
};

export const updateReviewLink = async (
    linkId: string,
    updates: Partial<ReviewLink>
): Promise<void> => {
    try {
        const linkDoc = doc(db, REVIEW_LINKS_COLLECTION, linkId);
        const updateData = {...updates};

        // Конвертируем Date в Timestamp если есть expiresAt
        if (updateData.expiresAt) {
            updateData.expiresAt = Timestamp.fromDate(updateData.expiresAt) as any;
        }

        await updateDoc(linkDoc, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating review link:', error);
        throw new Error('Failed to update review link');
    }
};

export const deactivateReviewLink = async (linkId: string): Promise<void> => {
    try {
        await updateReviewLink(linkId, {isActive: false});
    } catch (error) {
        console.error('Error deactivating review link:', error);
        throw new Error('Failed to deactivate review link');
    }
};

/**
 * ОТЗЫВЫ
 */
export const createReview = async (
    reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>,
    reviewToken?: string
): Promise<{ createdAt: Date; isPublic: boolean; id: any; updatedAt: Date }> => {
    try {
        // Проверяем лимит отзывов пользователя
        const user = await getUserProfile(reviewData.storeOwnerId);
        if (!user) {
            throw new Error('Store owner not found');
        }

        if (user.subscription.reviewsUsed >= user.subscription.reviewsLimit) {
            throw new Error('Review limit exceeded for current subscription plan');
        }

        // Проверяем валидность ссылки если передан токен
        if (reviewToken) {
            const linkDoc = await getDoc(doc(db, REVIEW_LINKS_COLLECTION, reviewToken));
            if (!linkDoc.exists() || !linkDoc.data()?.isActive) {
                throw new Error('Invalid or expired review link');
            }

            // Увеличиваем счетчик использования ссылки
            await updateDoc(doc(db, REVIEW_LINKS_COLLECTION, reviewToken), {
                usageCount: increment(1),
                updatedAt: serverTimestamp(),
            });
        }

        // Создаем отзыв (БЕЗ модерации - сразу публичный)
        const reviewWithTimestamps = {
            ...reviewData,
            isPublic: true,
            metadata: {
                ...reviewData.metadata,
                reviewToken: reviewToken || null,
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewWithTimestamps);

        // Увеличиваем счетчик использованных отзывов
        await updateDoc(doc(db, USERS_COLLECTION, reviewData.storeOwnerId), {
            'subscription.reviewsUsed': increment(1),
            updatedAt: serverTimestamp(),
        });

        return {
            ...reviewData,
            id: docRef.id,
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

export const getReviewsByStoreOwner = async (
    storeOwnerId: string,
    limitCount: number = 50
): Promise<Review[]> => {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where('storeOwnerId', '==', storeOwnerId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const reviews: Review[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            reviews.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Review);
        });

        return reviews;
    } catch (error) {
        console.error('Error getting reviews:', error);
        throw new Error('Failed to get reviews');
    }
};

export const getPublicReviews = async (
    storeOwnerId: string,
    limitCount: number = 20
): Promise<Review[]> => {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where('storeOwnerId', '==', storeOwnerId),
            where('isPublic', '==', true),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const reviews: Review[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            reviews.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Review);
        });

        return reviews;
    } catch (error) {
        console.error('Error getting public reviews:', error);
        throw new Error('Failed to get public reviews');
    }
};

export const updateReview = async (reviewId: string, updates: Partial<Review>): Promise<void> => {
    try {
        const reviewDoc = doc(db, REVIEWS_COLLECTION, reviewId);
        await updateDoc(reviewDoc, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating review:', error);
        throw new Error('Failed to update review');
    }
};

export const deleteReview = async (reviewId: string, storeOwnerId: string): Promise<void> => {
    try {
        // Удаляем отзыв
        await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));

        // Уменьшаем счетчик использованных отзывов
        await updateDoc(doc(db, USERS_COLLECTION, storeOwnerId), {
            'subscription.reviewsUsed': increment(-1),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        throw new Error('Failed to delete review');
    }
};

/**
 * ПУБЛИЧНЫЕ ФУНКЦИИ ДЛЯ СОЗДАНИЯ ОТЗЫВОВ
 */
export const createPublicReview = async (
    reviewToken: string,
    reviewData: {
        customerName: string;
        customerEmail?: string;
        rating: number;
        title?: string;
        content: string;
        photos?: string[];
        metadata?: {
            ipAddress?: string;
            userAgent?: string;
        };
    }
): Promise<Review> => {
    try {
        // Получаем информацию о ссылке
        const reviewLink = await getReviewLink(reviewToken);
        if (!reviewLink || !reviewLink.isActive) {
            throw new Error('Invalid or expired review link');
        }

        // Создаем отзыв
        const fullReviewData = {
            storeOwnerId: reviewLink.storeOwnerId,
            customerName: reviewData.customerName,
            customerEmail: reviewData.customerEmail,
            rating: reviewData.rating,
            title: reviewData.title || '',
            content: reviewData.content,
            photos: reviewData.photos || [],
            isPublic: true,
            metadata: {
                ...reviewData.metadata,
                source: 'DIRECT_LINK' as const,
                reviewToken,
            },
        };

        return await createReview(fullReviewData, reviewToken);
    } catch (error) {
        console.error('Error creating public review:', error);
        throw error;
    }
};

/**
 * ПОДПИСКИ НА ИЗМЕНЕНИЯ
 */
export const subscribeToReviews = (
    storeOwnerId: string,
    callback: (reviews: Review[]) => void
) => {
    const q = query(
        collection(db, REVIEWS_COLLECTION),
        where('storeOwnerId', '==', storeOwnerId),
        orderBy('createdAt', 'desc'),
        limit(50)
    );

    return onSnapshot(q, (querySnapshot) => {
        const reviews: Review[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            reviews.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Review);
        });
        callback(reviews);
    });
};

export const subscribeToUserProfile = (
    uid: string,
    callback: (user: User | null) => void
) => {
    const userDoc = doc(db, USERS_COLLECTION, uid);

    return onSnapshot(userDoc, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const user: User = {
                ...data,
                uid: docSnap.id,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                subscription: {
                    ...data.subscription,
                    startDate: data.subscription?.startDate?.toDate() || new Date(),
                    endDate: data.subscription?.endDate?.toDate(),
                    renewalDate: data.subscription?.renewalDate?.toDate(),
                },
            } as User;
            callback(user);
        } else {
            callback(null);
        }
    });
};

/**
 * СТАТИСТИКА
 */
export const getReviewStats = async (storeOwnerId: string) => {
    try {
        const reviewsRef = collection(db, REVIEWS_COLLECTION);

        // Общее количество отзывов
        const totalQuery = query(reviewsRef, where('storeOwnerId', '==', storeOwnerId));
        const totalSnapshot = await getDocs(totalQuery);
        const totalReviews = totalSnapshot.size;

        // Публичные отзывы
        const publicQuery = query(
            reviewsRef,
            where('storeOwnerId', '==', storeOwnerId),
            where('isPublic', '==', true)
        );
        const publicSnapshot = await getDocs(publicQuery);
        const publicReviews = publicSnapshot.size;

        // Средний рейтинг и распределение по звездам
        let totalRating = 0;
        const ratingDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

        totalSnapshot.forEach((doc) => {
            const data = doc.data();
            const rating = data.rating || 0;
            totalRating += rating;
            if (rating >= 1 && rating <= 5) {
                ratingDistribution[rating as keyof typeof ratingDistribution]++;
            }
        });

        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        // Отзывы за последние 30 дней
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentQuery = query(
            reviewsRef,
            where('storeOwnerId', '==', storeOwnerId),
            where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo))
        );
        const recentSnapshot = await getDocs(recentQuery);
        const recentReviews = recentSnapshot.size;

        return {
            totalReviews,
            publicReviews,
            recentReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution,
        };
    } catch (error) {
        console.error('Error getting review stats:', error);
        throw new Error('Failed to get review statistics');
    }
};

export const getDashboardStats = async (storeOwnerId: string) => {
    try {
        const user = await getUserProfile(storeOwnerId);
        if (!user) {
            throw new Error('User not found');
        }

        const reviewStats = await getReviewStats(storeOwnerId);

        // Статистика по ссылкам
        const links = await getReviewLinks(storeOwnerId);
        const activeLinks = links.filter(link => link.isActive).length;
        const totalLinkUsage = links.reduce((sum, link) => sum + link.usageCount, 0);

        return {
            // Информация о подписке
            subscription: {
                plan: user.subscription.plan,
                reviewsLimit: user.subscription.reviewsLimit,
                reviewsUsed: user.subscription.reviewsUsed,
                reviewsRemaining: user.subscription.reviewsLimit - user.subscription.reviewsUsed,
                usagePercentage: (user.subscription.reviewsUsed / user.subscription.reviewsLimit) * 100,
            },

            // Статистика отзывов
            reviews: reviewStats,

            // Статистика ссылок
            links: {
                total: links.length,
                active: activeLinks,
                totalUsage: totalLinkUsage,
            },
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        throw new Error('Failed to get dashboard statistics');
    }
};