import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from './Input';

describe('Input', () => {
    it('renders correctly', () => {
        render(<Input placeholder="Enter text" />);
        const input = screen.getByPlaceholderText('Enter text');
        expect(input).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Input className="custom-class" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('custom-class');
    });

    it('should have no accessibility violations', async () => {
        const { container } = render(
            <div>
                <label htmlFor="test-input">Label</label>
                <Input id="test-input" />
            </div>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
