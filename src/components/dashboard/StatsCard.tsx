import {Card, CardContent} from '@/components/ui/card';
import Skeleton from 'react-loading-skeleton';
import {StatsCardProps} from '@/types/dashboard';

export const StatsCard = ({title, value, icon, loading = false}: StatsCardProps) => {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm">{title}</p>
                        <p className="text-2xl font-bold text-white">
                            {loading ? (
                                <Skeleton
                                    width={50}
                                    height={30}
                                    baseColor="#2d2d2d"
                                    highlightColor="#3d3d3d"
                                    style={{display: 'inline-block'}}
                                />
                            ) : (
                                value
                            )}
                        </p>
                    </div>
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
};
