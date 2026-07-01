import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './Combobox';

const meta: Meta<typeof Combobox> = {
    title: 'Molecules/Combobox',
    component: Combobox,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const frameworks = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
];

export const Default: Story = {
    args: {
        options: frameworks,
        placeholder: 'Select framework...',
        className: 'w-[280px]',
    },
};
