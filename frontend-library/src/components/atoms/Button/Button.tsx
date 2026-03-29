import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary:
                    'bg-blue-600 text-white shadow hover:bg-blue-600/90',
                danger:
                    'bg-red-600 text-white shadow-sm hover:bg-red-600/90',
                outline:
                    'border border-gray-200 bg-transparent shadow-sm hover:bg-gray-100 hover:text-gray-900',
                secondary:
                    'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-100/80',
                ghost: 'hover:bg-gray-100 hover:text-gray-900',
                link: 'text-blue-600 underline-offset-4 hover:underline',
            },
            size: {
                md: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

/**
 * Props for the Button component.
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    /**
     * Whether to render the button as a child component (using Radix Slot).
     * Useful for rendering the button as a link or other element while keeping styles.
     */
    asChild?: boolean;
}

/**
 * A highly customizable Button component built with Radix UI Slot and Tailwind CSS.
 * Supports multiple variants, sizes, and can be rendered as a different element using `asChild`.
 * 
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * 
 * @example
 * <Button asChild>
 *   <a href="/login">Login</a>
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
