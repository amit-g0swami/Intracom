import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from '../../atoms/Input';
import { Textarea } from '../../atoms/Textarea';
import { DatePicker } from '../DatePicker';
import { DateRangePicker } from '../DateRangePicker';

const meta: Meta<typeof FormField> = {
    title: 'Molecules/FormField',
    component: FormField,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const WithInput: Story = {
    render: (args) => (
        <FormField {...args}>
            <Input placeholder="Enter your name" />
        </FormField>
    ),
    args: {
        label: 'Username',
        description: 'This is your public display name.',
    },
};

export const WithTextarea: Story = {
    render: (args) => (
        <FormField {...args}>
            <Textarea placeholder="Tell us about yourself" />
        </FormField>
    ),
    args: {
        label: 'Bio',
        description: 'Write a short bio about yourself.',
    },
};

export const WithError: Story = {
    render: (args) => (
        <FormField {...args}>
            <Input defaultValue="invalid-email" />
        </FormField>
    ),
    args: {
        label: 'Email',
        error: 'Please enter a valid email address.',
    },
};

export const Required: Story = {
    render: (args) => (
        <FormField {...args}>
            <Input type="password" />
        </FormField>
    ),
    args: {
        label: 'Password',
        required: true,
    },
};

export const WithDatePicker: Story = {
    render: (args) => (
        <FormField {...args}>
            <DatePicker placeholder="Pick a date" className="w-full" />
        </FormField>
    ),
    args: {
        label: 'Start date',
        description: 'Select when the event begins.',
    },
};

export const WithDateRangePicker: Story = {
    render: (args) => (
        <FormField {...args}>
            <DateRangePicker numberOfMonths={1} className="w-full" />
        </FormField>
    ),
    args: {
        label: 'Reporting period',
        description: 'Choose the start and end dates.',
    },
};

export const WithDatePickerError: Story = {
    render: (args) => (
        <FormField {...args}>
            <DatePicker placeholder="Pick a due date" className="w-full" />
        </FormField>
    ),
    args: {
        label: 'Due date',
        error: 'Please select a valid due date.',
    },
};
