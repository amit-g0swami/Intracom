import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
    it('renders with placeholder', () => {
        render(<DateRangePicker placeholder="Select range" numberOfMonths={1} />);
        expect(screen.getByRole('button', { name: /select range/i })).toBeInTheDocument();
    });

    it('opens the calendar popover on click', async () => {
        const user = userEvent.setup();
        render(<DateRangePicker placeholder="Select range" numberOfMonths={1} />);

        await user.click(screen.getByRole('button', { name: /select range/i }));

        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
        const { container } = render(
            <div>
                <label htmlFor="report-range">Report range</label>
                <DateRangePicker id="report-range" numberOfMonths={1} />
            </div>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
