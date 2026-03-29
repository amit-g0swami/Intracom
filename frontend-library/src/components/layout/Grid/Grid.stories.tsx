import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
    title: 'Layout/Grid',
    component: Grid,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
    render: () => (
        <Grid cols={3} gap={4}>
            <div className="bg-blue-100 p-8 rounded-md text-center">Item 1</div>
            <div className="bg-blue-100 p-8 rounded-md text-center">Item 2</div>
            <div className="bg-blue-100 p-8 rounded-md text-center">Item 3</div>
            <div className="bg-blue-100 p-8 rounded-md text-center">Item 4</div>
            <div className="bg-blue-100 p-8 rounded-md text-center">Item 5</div>
            <div className="bg-blue-100 p-8 rounded-md text-center">Item 6</div>
        </Grid>
    ),
};
