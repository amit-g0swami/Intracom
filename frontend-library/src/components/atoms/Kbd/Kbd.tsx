import * as React from 'react';
import { cn } from '../../../lib/utils';

export type KbdProps = React.HTMLAttributes<HTMLElement>;

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
    ({ className, ...props }, ref) => (
        <kbd
            ref={ref}
            className={cn(
                'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-input bg-secondary px-1.5 font-mono text-[10px] font-medium text-secondary-foreground',
                className
            )}
            {...props}
        />
    )
);
Kbd.displayName = 'Kbd';

export { Kbd };
