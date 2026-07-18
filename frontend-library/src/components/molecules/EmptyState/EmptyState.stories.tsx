import type { Meta, StoryObj } from '@storybook/react';
import { MessageSquare } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof EmptyState> = {
    title: 'Molecules/EmptyState',
    component: EmptyState,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
    args: {
        icon: <MessageSquare className="h-6 w-6" />,
        title: 'Select a conversation',
        description: 'Choose a thread from the inbox to start chatting.',
    },
};

export const WithAction: Story = {
    args: {
        icon: <MessageSquare className="h-6 w-6" />,
        title: 'No messages yet',
        description: 'Start a new conversation to get going.',
        action: <Button>New message</Button>,
    },
};
