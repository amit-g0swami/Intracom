import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';
import { Button } from '../../atoms/Button';
import { Avatar, AvatarFallback } from '../../atoms/Avatar';

const meta: Meta<typeof HoverCard> = {
    title: 'Molecules/HoverCard',
    component: HoverCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
    render: () => (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link">@intracom</Button>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarFallback>IC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Intracom</p>
                        <p className="text-xs text-[var(--sp-text-muted)]">
                            Internal communications platform.
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    ),
};
