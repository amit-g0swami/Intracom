import * as React from 'react';
import { cn } from '../../../lib/utils';

const Grid = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        cols?: number;
        gap?: number;
    }
>(({ className, cols = 1, gap = 4, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'grid w-full',
            cols === 1 && 'grid-cols-1',
            cols === 2 && 'grid-cols-1 sm:grid-cols-2',
            cols === 3 && 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
            cols === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
            gap === 1 && 'gap-1',
            gap === 2 && 'gap-2',
            gap === 4 && 'gap-4',
            gap === 6 && 'gap-6',
            gap === 8 && 'gap-8',
            className
        )}
        {...props}
    />
));
Grid.displayName = 'Grid';

export { Grid };
