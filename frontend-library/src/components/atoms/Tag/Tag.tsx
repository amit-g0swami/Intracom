import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const tagVariants = cva(
    'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-secondary text-secondary-foreground',
                outline: 'border-input text-foreground',
                primary: 'border-transparent bg-primary text-primary-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface TagProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof tagVariants> {
    onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
    ({ className, variant, children, onRemove, ...props }, ref) => (
        <span
            ref={ref}
            className={cn(tagVariants({ variant }), className)}
            {...props}
        >
            {children}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring"
                    aria-label="Remove"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    )
);
Tag.displayName = 'Tag';

export { Tag, tagVariants };
