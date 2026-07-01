import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
    title: 'Atoms/SearchInput',
    component: SearchInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
    args: {
        placeholder: 'Search...',
        className: 'max-w-sm',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Search disabled',
        className: 'max-w-sm',
    },
};
