import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    noIndex?: boolean;
}

export default function SEO({
                                title,
                                description,
                                keywords,
                                image = '/src/images/og-image.png',
                                url = window.location.href,
                                type = 'website',
                                noIndex = true
                            }: SEOProps) {
    const siteTitle = `${title} | ReviewInBio`;

    return (
        <Helmet>
            {/* Main meta tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Robots meta tag */}
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Open Graph for Facebook, Instagram, LinkedIn, WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="ReviewInBio" />
            <meta property="og:locale" content="uk_UA"/>

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* LinkedIn */}
            <meta property="og:image:type" content="image/jpeg" />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
}