import {Link} from 'react-router-dom';
import logo from "@/images/logo.png";

export const LandingFooter = () => {
    return (
        <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto text-center">
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <div
                        className="w-8 h-8 flex items-center justify-center">
                        <img src={logo as string} alt="Logo"/>
                    </div>
                    <span className="text-xl font-bold text-white">
                        ReviewInBio
                    </span>
                </div>

                <div className="flex flex-col items-center space-y-2
            sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-8
            text-sm text-gray-400 mb-6">
                    <a href="mailto:support@reviewinbio.com" className="hover:text-white transition-colors">support@reviewinbio.com</a>
                    <Link to="/privacy-policy" className="hover:text-white transition-colors">Політика конфіденційності</Link>
                    <Link to="/terms-of-use" className="hover:text-white transition-colors">Угода користувача</Link>
                </div>

                <p className="text-xs text-gray-500">
                    © 2025 ReviewInBio. Усі права захищені
                </p>
            </div>
        </footer>
    );
};
