import * as React from 'react';
import { cn } from '../../../lib/utils';

/**
 * Props for the Input component.
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * A versatile Input component built with Tailwind CSS.
 * Supports all standard HTML input attributes.
 * 
 * @example
 * <Input type="email" placeholder="Enter your email" />
 * 
 * @example
 * <Input disabled placeholder="Disabled input" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };
