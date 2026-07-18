import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { buttonVariants } from '../Button/Button';
import { cn } from '../../../lib/utils';

export type CalendarProps = DayPickerProps;

/**
 * Accessible calendar grid built on react-day-picker.
 * Styled to match Intracom form controls and used by DatePicker / DateRangePicker.
 *
 * @example
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 */
const Calendar = ({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) => {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col gap-4 sm:flex-row',
                month: 'flex flex-col gap-4',
                month_caption: 'relative flex items-center justify-center pt-1',
                caption_label: 'text-sm font-medium text-foreground',
                nav: 'flex items-center gap-1',
                button_previous: cn(
                    buttonVariants({ variant: 'outline', size: 'icon' }),
                    'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                button_next: cn(
                    buttonVariants({ variant: 'outline', size: 'icon' }),
                    'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                month_grid: 'mt-2 w-full border-collapse',
                weekdays: 'flex',
                weekday:
                    'w-9 rounded-md text-[0.8rem] font-normal text-[var(--sp-text-muted)]',
                week: 'mt-2 flex w-full',
                day: cn(
                    'relative h-9 w-9 p-0 text-center text-sm',
                    '[&:has([aria-selected].day-range-end)]:rounded-r-md',
                    '[&:has([aria-selected].day-outside)]:bg-secondary/50',
                    '[&:has([aria-selected])]:bg-secondary',
                    'first:[&:has([aria-selected])]:rounded-l-md',
                    'last:[&:has([aria-selected])]:rounded-r-md',
                    'focus-within:relative focus-within:z-20'
                ),
                day_button: cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'h-9 w-9 p-0 font-normal text-foreground aria-selected:opacity-100'
                ),
                range_start: 'day-range-start rounded-l-md',
                range_end: 'day-range-end rounded-r-md',
                selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                today: 'bg-secondary text-secondary-foreground',
                outside:
                    'day-outside text-[var(--sp-text-muted)] opacity-50 aria-selected:bg-secondary/50 aria-selected:text-[var(--sp-text-muted)] aria-selected:opacity-30',
                disabled: 'text-[var(--sp-text-muted)] opacity-50',
                range_middle:
                    'aria-selected:bg-secondary aria-selected:text-secondary-foreground',
                hidden: 'invisible',
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
                    const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;

                    return (
                        <Icon
                            className={cn('h-4 w-4', chevronClassName)}
                            {...chevronProps}
                        />
                    );
                },
            }}
            {...props}
        />
    );
};
Calendar.displayName = 'Calendar';

export { Calendar };
