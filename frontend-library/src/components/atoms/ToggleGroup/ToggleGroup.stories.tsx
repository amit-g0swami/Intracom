import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

const meta: Meta<typeof ToggleGroup> = {
    title: 'Atoms/ToggleGroup',
    component: ToggleGroup,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
    render: () => (
        <ToggleGroup type="single" defaultValue="list">
            <ToggleGroupItem value="list" aria-label="List view">
                List
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
                Grid
            </ToggleGroupItem>
        </ToggleGroup>
    ),
};
