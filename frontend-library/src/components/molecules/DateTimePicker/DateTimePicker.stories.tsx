import type { Meta, StoryObj } from '@storybook/react';
import { DateTimePicker } from './DateTimePicker';

const meta: Meta<typeof DateTimePicker> = {
    title: 'Molecules/DateTimePicker',
    component: DateTimePicker,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {
    args: {
        className: 'max-w-md',
    },
};
