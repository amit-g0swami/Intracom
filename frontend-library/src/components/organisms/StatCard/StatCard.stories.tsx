import type { Meta, StoryObj } from '@storybook/react';
import { Users } from 'lucide-react';
import { StatCard } from './StatCard';

const meta: Meta<typeof StatCard> = {
    title: 'Organisms/StatCard',
    component: StatCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
    args: {
        title: 'Total users',
        value: '2,350',
        description: 'from last month',
        trend: { value: '+12.5%', positive: true },
        icon: <Users className="h-4 w-4" />,
        className: 'max-w-xs',
    },
};
