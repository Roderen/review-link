import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext.tsx';
import { Helmet } from 'react-helmet-async';
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

    const handlePricingClick = () => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <Helmet>
                <title>Instagram Reviews - Сервис сбора отзывов для Instagram магазинов</title>
                <meta name="description" content="Простой и удобный сервис для сбора и отображения отзывов от ваших клиентов. Получите персональную ссылку, делитесь с покупателями и собирайте отзывы на красивой публичной странице." />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Instagram Reviews - Сервис сбора отзывов для Instagram магазинов" />
                <meta property="og:description" content="Простой и удобный сервис для сбора и отображения отзывов от ваших клиентов. Получите персональную ссылку, делитесь с покупателями и собирайте отзывы на красивой публичной странице." />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Instagram Reviews - Сервис сбора отзывов для Instagram магазинов" />
                <meta name="twitter:description" content="Простой и удобный сервис для сбора и отображения отзывов от ваших клиентов. Получите персональную ссылку, делитесь с покупателями и собирайте отзывы на красивой публичной странице." />

                {/* Keywords */}
                <meta name="keywords" content="отзывы, instagram, reviews, магазин, сбор отзывов, клиенты, онлайн магазин" />
            </Helmet>

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
