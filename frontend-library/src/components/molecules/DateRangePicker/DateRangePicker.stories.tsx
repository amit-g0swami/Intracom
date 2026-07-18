import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
    title: 'Molecules/DateRangePicker',
    component: DateRangePicker,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
    args: {
        placeholder: 'Pick a date range',
        className: 'w-[320px]',
    },
};

export const SingleMonth: Story = {
    args: {
        placeholder: 'Pick a date range',
        numberOfMonths: 1,
        className: 'w-[280px]',
    },
};

export const Disabled: Story = {
    render: (args) => (
        <DateRangePicker
            {...args}
            defaultValue={{ from: new Date(), to: new Date() }}
        />
    ),
    args: {
        disabled: true,
        placeholder: 'Pick a date range',
        numberOfMonths: 1,
        className: 'w-[280px]',
    },
};
