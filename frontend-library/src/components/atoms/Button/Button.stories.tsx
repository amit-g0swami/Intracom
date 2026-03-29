import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'icon'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Button',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Button',
    },
};

export const Danger: Story = {
    args: {
        variant: 'danger',
        children: 'Button',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Button',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        children: 'Button',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Button',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Button',
    },
};
