import {Card, CardContent} from '@/components/ui/card';
import Skeleton from 'react-loading-skeleton';

export const LoadingSkeleton = () => {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                            <Skeleton
                                circle
                                width={48}
                                height={48}
                                baseColor="#2d2d2d"
                                highlightColor="#3d3d3d"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <Skeleton
                                            width={120}
                                            height={20}
                                            baseColor="#2d2d2d"
                                            highlightColor="#3d3d3d"
                                            style={{marginBottom: '8px'}}
                                        />
                                        <Skeleton
                                            width={150}
                                            height={16}
                                            baseColor="#2d2d2d"
                                            highlightColor="#3d3d3d"
                                        />
                                    </div>
                                    <Skeleton
                                        width={50}
                                        height={24}
                                        baseColor="#2d2d2d"
                                        highlightColor="#3d3d3d"
                                    />
                                </div>
                                <Skeleton
                                    count={1}
                                    baseColor="#2d2d2d"
                                    highlightColor="#3d3d3d"
                                    style={{marginBottom: '16px'}}
                                />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton
                                            key={i}
                                            height={96}
                                            baseColor="#2d2d2d"
                                            highlightColor="#3d3d3d"
                                            style={{borderRadius: '8px'}}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
