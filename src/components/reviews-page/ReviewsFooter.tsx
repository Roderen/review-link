import {MessageSquare} from 'lucide-react';

export const ReviewsFooter = () => {
    return (
        <footer className="border-t border-gray-800 bg-gray-900 mt-16">
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <div
                        className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white"/>
                    </div>
                    <a href="/" className="font-semibold text-white">
                        ReviewInBio
                    </a>
                </div>
                <p className="text-xs text-gray-500">
                    © 2025 ReviewInBio. Усі права захищені
                </p>
            </div>
        </footer>
    );
};
