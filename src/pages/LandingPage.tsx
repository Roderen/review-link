import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext.tsx';
import { signInWithGoogle } from '@/lib/firebase';
import {LandingHeader} from '@/components/landing/LandingHeader';
import {HeroSection} from '@/components/landing/HeroSection';
import {HowItWorksSection} from '@/components/landing/HowItWorksSection';
import {BenefitsSection} from '@/components/landing/BenefitsSection';
import {PricingPreview} from '@/components/landing/PricingPreview';
import {CTASection} from '@/components/landing/CTASection';
import {LandingFooter} from '@/components/landing/LandingFooter';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        } else {
            setIsLoading(false);
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            // убрать navigate('/dashboard') отсюда
        } catch (error) {
            console.error('❌ Ошибка входа:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePricingClick = () => navigate('/pricing');

    return (
        <div className="min-h-screen bg-gray-950">
            <LandingHeader
                onLogin={handleGoogleLogin}
                onPricingClick={handlePricingClick}
                isLoading={isLoading}
            />

            <HeroSection
                onLogin={handleGoogleLogin}
                onPricingClick={handlePricingClick}
                isLoading={isLoading}
            />

            <HowItWorksSection />

            <BenefitsSection />

            <PricingPreview onLogin={handleGoogleLogin} isLoading={isLoading} />

            <CTASection onLogin={handleGoogleLogin} isLoading={isLoading} />

            <LandingFooter />
        </div>
    );
};

export default LandingPage;
