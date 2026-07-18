import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta: Meta<typeof Kbd> = {
    title: 'Atoms/Kbd',
    component: Kbd,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
    render: () => (
        <p className="text-sm text-[var(--sp-text-muted)]">
            Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open command palette
        </p>
    ),
};
