import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { type DateRange, type Matcher } from 'react-day-picker';
import { Calendar } from '../../atoms/Calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../Popover/Popover';
import { DEFAULT_DATE_FORMAT, formatDate } from '../../../lib/date';
import { cn } from '../../../lib/utils';
import { pickerTriggerStyles } from '../DatePicker/DatePicker';

export interface DateRangePickerProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange' | 'defaultValue'> {
    /** Controlled selected range. */
    value?: DateRange;
    /** Uncontrolled initial range. */
    defaultValue?: DateRange;
    /** Called when the user selects a range. */
    onChange?: (range: DateRange | undefined) => void;
    /** Placeholder when no range is selected. */
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
    /** Close the popover after both ends of the range are selected. */
    closeOnSelect?: boolean;
    /** Number of months displayed side by side. */
    numberOfMonths?: number;
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

function formatRangeLabel(
    range: DateRange | undefined,
    dateFormat: string,
    placeholder: string
): string {
    if (!range?.from) {
        return placeholder;
    }

    if (!range.to) {
        return formatDate(range.from, dateFormat);
    }

    return `${formatDate(range.from, dateFormat)} – ${formatDate(range.to, dateFormat)}`;
}

/**
 * Date range picker with a popover calendar supporting two-month views.
 *
 * @example
 * <DateRangePicker value={range} onChange={setRange} placeholder="Pick a date range" />
 */
const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
    (
        {
            value: valueProp,
            defaultValue,
            onChange,
            placeholder = 'Pick a date range',
            dateFormat = DEFAULT_DATE_FORMAT,
            minDate,
            maxDate,
            disabledDays,
            align = 'start',
            closeOnSelect = true,
            numberOfMonths = 2,
            disabled,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false);
        const [uncontrolledValue, setUncontrolledValue] = React.useState<DateRange | undefined>(
            defaultValue
        );

        const isControlled = valueProp !== undefined;
        const selectedRange = isControlled ? valueProp : uncontrolledValue;

        const handleSelect = (range: DateRange | undefined) => {
            if (!isControlled) {
                setUncontrolledValue(range);
            }

            onChange?.(range);

            if (closeOnSelect && range?.from && range?.to) {
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
                            !selectedRange?.from && 'text-[var(--sp-text-muted)]',
                            className
                        )}
                        {...props}
                    >
                        <span className="truncate">
                            {formatRangeLabel(selectedRange, dateFormat, placeholder)}
                        </span>
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={align}>
                    <Calendar
                        mode="range"
                        selected={selectedRange}
                        onSelect={handleSelect}
                        disabled={disabledMatchers}
                        defaultMonth={selectedRange?.from}
                        numberOfMonths={numberOfMonths}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>
        );
    }
);
DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
