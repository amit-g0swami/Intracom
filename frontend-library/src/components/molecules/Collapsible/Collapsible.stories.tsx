import type { Meta, StoryObj } from '@storybook/react';
import { CollapsibleSection } from './Collapsible';

const meta: Meta<typeof CollapsibleSection> = {
    title: 'Molecules/Collapsible',
    component: CollapsibleSection,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CollapsibleSection>;

export const Default: Story = {
    args: {
        title: 'Advanced settings',
        children: 'Configure notification preferences and privacy options here.',
    },
};
