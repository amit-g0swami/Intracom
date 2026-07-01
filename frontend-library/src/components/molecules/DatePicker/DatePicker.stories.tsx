import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
    title: 'Molecules/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
    args: {
        placeholder: 'Pick a date',
        className: 'w-[280px]',
    },
};

export const WithDefaultValue: Story = {
    render: (args) => <DatePicker {...args} defaultValue={new Date()} />,
    args: {
        placeholder: 'Pick a date',
        className: 'w-[280px]',
    },
};

export const Disabled: Story = {
    render: (args) => <DatePicker {...args} defaultValue={new Date()} />,
    args: {
        disabled: true,
        placeholder: 'Pick a date',
        className: 'w-[280px]',
    },
};

export const WithMinMax: Story = {
    render: (args) => {
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() - 7);
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 7);

        return (
            <DatePicker
                {...args}
                minDate={minDate}
                maxDate={maxDate}
            />
        );
    },
    args: {
        placeholder: 'Within ±7 days',
        className: 'w-[280px]',
    },
};
