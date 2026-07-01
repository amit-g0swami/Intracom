import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
    it('renders with placeholder', () => {
        render(<DatePicker placeholder="Select date" />);
        expect(screen.getByRole('button', { name: /select date/i })).toBeInTheDocument();
    });

    it('opens the calendar popover on click', async () => {
        const user = userEvent.setup();
        render(<DatePicker placeholder="Select date" />);

        await user.click(screen.getByRole('button', { name: /select date/i }));

        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('applies custom className to the trigger', () => {
        render(<DatePicker className="custom-picker" placeholder="Select date" />);
        expect(screen.getByRole('button', { name: /select date/i })).toHaveClass('custom-picker');
    });

    it('should have no accessibility violations', async () => {
        const { container } = render(
            <div>
                <label htmlFor="event-date">Event date</label>
                <DatePicker id="event-date" placeholder="Select date" />
            </div>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
