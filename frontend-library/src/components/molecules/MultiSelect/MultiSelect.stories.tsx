import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelect } from './MultiSelect';

const meta: Meta<typeof MultiSelect> = {
    title: 'Molecules/MultiSelect',
    component: MultiSelect,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const tags = [
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'tailwind', label: 'Tailwind' },
    { value: 'radix', label: 'Radix UI' },
];

export const Default: Story = {
    args: {
        options: tags,
        placeholder: 'Select tags...',
        className: 'w-[320px]',
    },
};
