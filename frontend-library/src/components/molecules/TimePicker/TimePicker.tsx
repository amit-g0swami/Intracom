import * as React from 'react';
import { cn } from '../../../lib/utils';

export interface TimePickerProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
    ({ className, value: valueProp, defaultValue, onChange, ...props }, ref) => {
        const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
        const isControlled = valueProp !== undefined;
        const value = isControlled ? valueProp : uncontrolledValue;

        return (
            <input
                ref={ref}
                type="time"
                value={value}
                onChange={(e) => {
                    if (!isControlled) {
                        setUncontrolledValue(e.target.value);
                    }
                    onChange?.(e.target.value);
                }}
                className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            />
        );
    }
);
TimePicker.displayName = 'TimePicker';

export { TimePicker };
