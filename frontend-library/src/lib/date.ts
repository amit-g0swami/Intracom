import { format, isValid, parse } from 'date-fns';

export const DEFAULT_DATE_FORMAT = 'PPP';

/**
 * Formats a date using date-fns. Returns an empty string for invalid dates.
 */
export function formatDate(
    date: Date | undefined | null,
    dateFormat: string = DEFAULT_DATE_FORMAT
): string {
    if (!date || !isValid(date)) {
        return '';
    }

    return format(date, dateFormat);
}

/**
 * Parses a date string using the given format. Returns undefined if parsing fails.
 */
export function parseDate(
    value: string,
    dateFormat: string = DEFAULT_DATE_FORMAT
): Date | undefined {
    const parsed = parse(value, dateFormat, new Date());

    return isValid(parsed) ? parsed : undefined;
}

/**
 * Returns true when the value is a valid Date instance.
 */
export function isValidDate(date: unknown): date is Date {
    return date instanceof Date && isValid(date);
}
