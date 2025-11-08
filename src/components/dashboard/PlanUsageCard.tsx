import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Crown} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import {PlanLimits} from '@/types/dashboard';

interface PlanUsageCardProps {
    currentPlan: PlanLimits;
    reviewsCount: number;
    usagePercentage: number;
    loading: boolean;
    showCrown: boolean;
    onChangePlan: () => void;
}

export const PlanUsageCard = ({
                                   currentPlan,
                                   reviewsCount,
                                   usagePercentage,
                                   loading,
                                   showCrown,
                                   onChangePlan
                               }: PlanUsageCardProps) => {
    return (
        <Card className="mb-8 bg-gray-900 border-gray-700">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            {showCrown && <Crown className="w-5 h-5 mr-2 text-yellow-500"/>}
                            Тариф: {currentPlan.name}
                        </h3>
                        <p className="text-gray-400">
                            {loading ? (
                                <Skeleton
                                    width={150}
                                    height={20}
                                    baseColor="#2d2d2d"
                                    highlightColor="#3d3d3d"
                                    style={{display: 'inline-block'}}
                                />
                            ) : (
                                currentPlan.reviews === Infinity
                                    ? `${reviewsCount} отзывов (безлимит)`
                                    : `${reviewsCount} из ${currentPlan.reviews} отзывов`
                            )}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={onChangePlan}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Изменить тариф
                    </Button>
                </div>

                {currentPlan.reviews !== Infinity && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                                usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{width: `${usagePercentage}%`}}
                        ></div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
