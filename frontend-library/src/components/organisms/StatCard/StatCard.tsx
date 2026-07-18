import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../Card/Card';
import { Typography } from '../../atoms/Typography';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    description?: string;
    trend?: {
        value: string;
        positive?: boolean;
    };
    icon?: React.ReactNode;
}

const StatCard = ({ className, title, value, description, trend, icon, ...props }: StatCardProps) => (
        <Card className={cn('', className)} {...props}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--sp-text-muted)]">
                    {title}
                </CardTitle>
                {icon && <div className="text-[var(--sp-text-muted)]">{icon}</div>}
            </CardHeader>
            <CardContent>
                <Typography variant="large" className="text-2xl font-bold">
                    {value}
                </Typography>
                {(description || trend) && (
                    <p className="mt-1 text-xs text-[var(--sp-text-muted)]">
                        {trend && (
                            <span
                                className={cn(
                                    'mr-1 font-medium',
                                    trend.positive ? 'text-[var(--sp-color-success-700)]' : 'text-[var(--sp-color-error-700)]'
                                )}
                            >
                                {trend.value}
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
);
StatCard.displayName = 'StatCard';

export { StatCard };
