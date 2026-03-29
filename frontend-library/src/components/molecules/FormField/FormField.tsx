import * as React from 'react';
import { Label } from '../../atoms/Label';
import { cn } from '../../../lib/utils';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: string;
    error?: string;
    description?: string;
    required?: boolean;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
    ({ label, error, description, required, children, className, ...props }, ref) => {
        const id = React.useId();

        // Clone children to inject id and aria attributes if they are inputs
        const content = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                const childProps = child.props as { id?: string };
                return React.cloneElement(child as React.ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }>, {
                    id: childProps.id ?? id,
                    'aria-describedby': cn(
                        description ? `${id}-description` : null,
                        error ? `${id}-error` : null
                    ),
                    'aria-invalid': !!error,
                });
            }
            return child;
        });

        return (
            <div ref={ref} className={cn('space-y-2', className)} {...props}>
                {label && (
                    <Label htmlFor={id} className={cn(error && 'text-red-600')}>
                        {label}
                        {required && <span className="ml-1 text-red-600">*</span>}
                    </Label>
                )}
                {content}
                {description && (
                    <p
                        id={`${id}-description`}
                        className="text-xs text-gray-500"
                    >
                        {description}
                    </p>
                )}
                {error && (
                    <p
                        id={`${id}-error`}
                        className="text-xs font-medium text-red-600"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
FormField.displayName = 'FormField';

export { FormField };
