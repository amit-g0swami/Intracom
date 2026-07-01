import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { type Matcher } from 'react-day-picker';
import { Calendar } from '../../atoms/Calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../Popover/Popover';
import { DEFAULT_DATE_FORMAT, formatDate } from '../../../lib/date';
import { cn } from '../../../lib/utils';

const pickerTriggerStyles =
    'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export interface DatePickerProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange' | 'defaultValue'> {
    /** Controlled selected date. */
    value?: Date;
    /** Uncontrolled initial date. */
    defaultValue?: Date;
    /** Called when the user selects a date. */
    onChange?: (date: Date | undefined) => void;
    /** Placeholder when no date is selected. */
    placeholder?: string;
    /** date-fns format string for the trigger label. */
    dateFormat?: string;
    /** Earliest selectable date. */
    minDate?: Date;
    /** Latest selectable date. */
    maxDate?: Date;
    /** Additional disabled day matchers passed to the calendar. */
    disabledDays?: Matcher | Matcher[];
    /** Popover alignment relative to the trigger. */
    align?: 'start' | 'center' | 'end';
    /** Close the popover after a date is selected. */
    closeOnSelect?: boolean;
}

function buildDisabledMatchers(
    minDate?: Date,
    maxDate?: Date,
    disabledDays?: Matcher | Matcher[]
): Matcher[] | undefined {
    const matchers: Matcher[] = [];

    if (minDate) {
        matchers.push({ before: minDate });
    }

    if (maxDate) {
        matchers.push({ after: maxDate });
    }

    if (disabledDays) {
        matchers.push(...(Array.isArray(disabledDays) ? disabledDays : [disabledDays]));
    }

    return matchers.length > 0 ? matchers : undefined;
}

/**
 * Date picker combining a form-control trigger with a popover calendar.
 *
 * @example
 * <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
 */
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    (
        {
            value: valueProp,
            defaultValue,
            onChange,
            placeholder = 'Pick a date',
            dateFormat = DEFAULT_DATE_FORMAT,
            minDate,
            maxDate,
            disabledDays,
            align = 'start',
            closeOnSelect = true,
            disabled,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false);
        const [uncontrolledValue, setUncontrolledValue] = React.useState<Date | undefined>(
            defaultValue
        );

        const isControlled = valueProp !== undefined;
        const selectedDate = isControlled ? valueProp : uncontrolledValue;

        const handleSelect = (date: Date | undefined) => {
            if (!isControlled) {
                setUncontrolledValue(date);
            }

            onChange?.(date);

            if (closeOnSelect) {
                setOpen(false);
            }
        };

        const disabledMatchers = buildDisabledMatchers(minDate, maxDate, disabledDays);

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        ref={ref}
                        type="button"
                        id={id}
                        disabled={disabled}
                        className={cn(
                            pickerTriggerStyles,
                            !selectedDate && 'text-[var(--sp-text-muted)]',
                            className
                        )}
                        {...props}
                    >
                        <span className="truncate">
                            {selectedDate
                                ? formatDate(selectedDate, dateFormat)
                                : placeholder}
                        </span>
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={align}>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        disabled={disabledMatchers}
                        defaultMonth={selectedDate}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>
        );
    }
);
DatePicker.displayName = 'DatePicker';

export { DatePicker, pickerTriggerStyles };
