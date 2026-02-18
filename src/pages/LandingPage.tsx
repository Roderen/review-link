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
import SEO from "@/components/SEO.tsx";

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
            // Navigation will happen automatically via useEffect when AuthContext updates user state
            // AuthContext now has retry logic to handle race condition with Firestore
        } catch (error) {
            console.error('❌ Ошибка входа:', error);
            setIsLoading(false);
        }
    };

    const handlePricingClick = () => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            <SEO
                title="Сервіс збору відгуків для Instagram магазинів"
                description="Простий та зручний сервіс для збору та відображення відгуків від ваших клієнтів. Отримайте персональне посилання, діліться з покупцями та збирайте відгуки на красивій публічній сторінці."
                keywords="відгуки, instagram, reviews, магазин, збір відгуків, клієнти, онлайн магазин"
                type="website"
                noIndex={false}
            />

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

                <HowItWorksSection/>

                <BenefitsSection/>

                <PricingPreview onLogin={handleGoogleLogin} isLoading={isLoading}/>

                <CTASection onLogin={handleGoogleLogin} isLoading={isLoading}/>

                <LandingFooter/>
            </div>
        </>
    );
};

export default LandingPage;
