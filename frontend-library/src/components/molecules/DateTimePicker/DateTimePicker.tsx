import * as React from 'react';
import { DatePicker } from '../DatePicker/DatePicker';
import { TimePicker } from '../TimePicker/TimePicker';
import { cn } from '../../../lib/utils';

export interface DateTimePickerProps {
    value?: { date?: Date; time?: string };
    defaultValue?: { date?: Date; time?: string };
    onChange?: (value: { date?: Date; time?: string }) => void;
    datePlaceholder?: string;
    className?: string;
    disabled?: boolean;
}

const DateTimePicker = ({
    value: valueProp,
    defaultValue,
    onChange,
    datePlaceholder = 'Pick a date',
    className,
    disabled,
}: DateTimePickerProps) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? {});
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolled;

    const update = (patch: Partial<{ date?: Date; time?: string }>) => {
        const next = { ...value, ...patch };
        if (!isControlled) {
            setUncontrolled(next);
        }
        onChange?.(next);
    };

    return (
        <div className={cn('flex flex-col gap-2 sm:flex-row', className)}>
            <DatePicker
                value={value.date}
                onChange={(date) => update({ date })}
                placeholder={datePlaceholder}
                disabled={disabled}
                className="flex-1"
            />
            <TimePicker
                value={value.time}
                onChange={(time) => update({ time })}
                disabled={disabled}
                className="w-full sm:w-[140px]"
            />
        </div>
    );
};
DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker };
