import type { Meta, StoryObj } from '@storybook/react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from './ContextMenu';

const meta: Meta<typeof ContextMenu> = {
    title: 'Organisms/ContextMenu',
    component: ContextMenu,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed border-input text-sm text-[var(--sp-text-muted)]">
                Right click here
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>
                    Back
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem disabled>Forward</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="text-[var(--sp-color-error-700)]">Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
};
