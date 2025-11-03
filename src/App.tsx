import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import {AuthProvider, useAuth} from '@/contexts/AuthContext.tsx';

import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import Dashboard from './pages/Dashboard';
import ReviewForm from './pages/ReviewForm';
import ReviewsPage from './pages/ReviewsPage';
import TestPage from "./pages/TestPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white">Загрузка...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const AppContent: React.FC = () => {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white text-xl">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/review/:username" element={<ReviewForm />} />
                <Route path="/u/:username" element={<ReviewsPage />} />
                <Route path="/test" element={<TestPage />} />
            </Routes>
            <Toaster theme="dark" />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router basename={import.meta.env.VITE_BASE_URL || '/'}>
                <AppContent /> {}
            </Router>
        </AuthProvider>
    );
}

export default App;