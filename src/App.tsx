import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';
import {AuthProvider, useAuth} from '@/contexts/AuthContext.tsx';

import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import Dashboard from './pages/Dashboard';
import ReviewForm from './pages/ReviewForm';
import ReviewsPage from './pages/ReviewsPage';
import TestPage from "./pages/TestPage";
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import PrivacyPolicy from "@/pages/PrivacyPolicy.tsx";

import LoadingSpinner from "@/components/LoadingSpinner";
import TermsOfUse from "@/pages/TermsOfUse.tsx";
import ScrollToTop from "@/components/ScrollToTop.tsx";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Если статус pending, перенаправляем на страницу ожидания
    if (user.accountStatus === 'pending') {
        return <Navigate to="/pending" replace />;
    }

    return <>{children}</>;
};

const PendingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Если статус уже активен, перенаправляем в dashboard
    if (user.accountStatus === 'active') {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const AppContent: React.FC = () => {
    const { isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/pricing" element={<PricingPage/>}/>
                <Route path="/payment/success" element={<PaymentSuccessPage/>}/>
                <Route path="/payment/cancel" element={<PaymentCancelPage/>}/>
                <Route
                    path="/pending"
                    element={
                        <PendingRoute>
                            <PendingApprovalPage/>
                        </PendingRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />
                <Route path="/review/:username" element={<ReviewForm/>}/>
                <Route path="/u/:username" element={<ReviewsPage/>}/>
                <Route path="/test" element={<TestPage/>}/>

                <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                <Route path="/terms-of-use" element={<TermsOfUse/>}/>
            </Routes>
            <Toaster theme="dark"/>
        </div>
    );
};

function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
                <Router basename={import.meta.env.VITE_BASE_URL || '/'}>
                    <ScrollToTop />
                    <AppContent/> {}
                </Router>
            </AuthProvider>
        </HelmetProvider>
    );
}

export default App;