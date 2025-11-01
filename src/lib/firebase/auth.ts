import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '@/lib/firebase/firebase-config.ts';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            plan: 'free',
            reviewsCount: 0,
            totalRating: 0,
            createdAt: serverTimestamp(),
            status: 'pending',
        });
    }

    return user;
};