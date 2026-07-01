import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../../atoms/Typography';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({ className, icon, title, description, action, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex flex-col items-center justify-center rounded-lg border border-dashed border-input bg-secondary/30 px-6 py-12 text-center',
                className
            )}
            {...props}
        >
            {icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                    {icon}
                </div>
            )}
            <Typography variant="h4" className="mb-1 border-0">
                {title}
            </Typography>
            {description && (
                <Typography variant="muted" className="mb-4 max-w-sm">
                    {description}
                </Typography>
            )}
            {action}
        </div>
    )
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
