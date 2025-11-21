// context/AuthContext.tsx

import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
  plan: 'FREE' | 'PRO' | 'BUSINESS';
  description?: string;
  averageRating?: number;
  totalReviews?: number;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                        children,
                                                                      }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || '',
            username: '', // если у вас будет отдельное поле
            ...userData,
            // Normalize plan to uppercase to match type definition
            plan: (userData.plan ? (userData.plan as string).toUpperCase() : 'FREE') as 'FREE' | 'PRO' | 'BUSINESS',
          } as User);
        } else {
          setUser(null); // нет записи в Firestore — можно редиректить/создать
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, logout, isLoading }}>
        {children}
      </AuthContext.Provider>
  );
};
