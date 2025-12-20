import {MessageSquare} from 'lucide-react';

export const LandingFooter = () => {
    return (
        <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto text-center">
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <div
                        className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white"/>
                    </div>
                    <span className="text-xl font-bold text-white">
                        ReviewInBio
                    </span>
                </div>

                <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-6">
                    <a href="#" className="hover:text-white transition-colors">support@reviewinbio.com</a>
                    <a href="#" className="hover:text-white transition-colors">Угода користувача</a>
                    <a href="#" className="hover:text-white transition-colors">Політика конфіденційності</a>
                </div>

                <p className="text-xs text-gray-500">
                    © 2025 ReviewInBio. Усі права захищені
                </p>
            </div>
        </footer>
    );
};
