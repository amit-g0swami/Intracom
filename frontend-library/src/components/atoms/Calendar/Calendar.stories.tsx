import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
    title: 'Atoms/Calendar',
    component: Calendar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
    args: {
        mode: 'single',
    },
};

export const WithSelectedDate: Story = {
    render: () => (
        <Calendar
            mode="single"
            selected={new Date()}
            defaultMonth={new Date()}
        />
    ),
};

export const Range: Story = {
    args: {
        mode: 'range',
        numberOfMonths: 2,
        defaultMonth: new Date(),
    },
};
