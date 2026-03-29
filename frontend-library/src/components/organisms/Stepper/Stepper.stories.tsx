import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
    title: 'Organisms/Stepper',
    component: Stepper,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = [
    { title: 'Personal Info', description: 'Name and email' },
    { title: 'Billing', description: 'Address and card' },
    { title: 'Review', description: 'Check your order' },
];

export const Default: Story = {
    args: {
        steps,
        currentStep: 1,
    },
};

export const FirstStep: Story = {
    args: {
        steps,
        currentStep: 0,
    },
};

export const Completed: Story = {
    args: {
        steps,
        currentStep: 3,
    },
};
