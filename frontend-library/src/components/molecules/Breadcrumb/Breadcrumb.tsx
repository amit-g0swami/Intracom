import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
    separator?: React.ReactNode;
}

const Breadcrumb = ({ className, separator, children, ...props }: BreadcrumbProps) => {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex items-center text-sm', className)}
            {...props}
        >
            <ol className="flex items-center space-x-2">
                {React.Children.map(children, (child, index) => {
                    const isLast = index === React.Children.count(children) - 1;
                    return (
                        <>
                            <li className="flex items-center">
                                {child}
                            </li>
                            {!isLast && (
                                <li className="text-gray-400">
                                    {separator ?? <ChevronRight className="h-4 w-4" />}
                                </li>
                            )}
                        </>
                    );
                })}
            </ol>
        </nav>
    );
};

export interface BreadcrumbItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    active?: boolean;
}

const BreadcrumbItem = ({ className, active, children, ...props }: BreadcrumbItemProps) => {
    if (active) {
        return (
            <span className={cn('font-medium text-gray-900', className)}>
                {children}
            </span>
        );
    }

    return (
        <a
            className={cn(
                'text-gray-500 hover:text-gray-900 transition-colors cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </a>
    );
};

export { Breadcrumb, BreadcrumbItem };
