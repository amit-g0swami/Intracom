import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
    title: 'Atoms/Slider',
    component: Slider,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    render: (args) => (
        <Slider {...args} defaultValue={[50]} max={100} step={1} className="max-w-sm" />
    ),
};
