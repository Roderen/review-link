import {Button} from '@/components/ui/button';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({currentPage, totalPages, onPageChange}: PaginationProps) => {
    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4 mr-1"/>
                Назад
            </Button>

            <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;

                    if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                        return (
                            <Button
                                key={pageNumber}
                                variant={isCurrentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageNumber)}
                                className={
                                    isCurrentPage
                                        ? "bg-gray-700 text-white border-gray-600"
                                        : "border-gray-600 text-gray-300 hover:bg-gray-800"
                                }
                            >
                                {pageNumber}
                            </Button>
                        );
                    } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                    ) {
                        return <span key={pageNumber} className="text-gray-500 px-1">...</span>;
                    }
                    return null;
                })}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Вперед
                <ChevronRight className="w-4 h-4 ml-1"/>
            </Button>
        </div>
    );
};
