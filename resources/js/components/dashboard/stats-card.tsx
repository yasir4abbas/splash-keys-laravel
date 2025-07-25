import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({ title, value, icon, description, trend, className }: StatsCardProps) {
    return (
        <Card className={cn('', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon iconNode={icon} className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
                {trend && (
                    <div className="flex items-center text-xs mt-1">
                        <Icon
                            iconNode={trend.isPositive ? TrendingUp : TrendingDown}
                            className={cn(
                                'h-3 w-3 mr-1',
                                trend.isPositive ? 'text-green-500' : 'text-red-500'
                            )}
                        />
                        <span
                            className={cn(
                                trend.isPositive ? 'text-green-500' : 'text-red-500'
                            )}
                        >
                            {trend.value}%
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 