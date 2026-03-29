import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
    title: 'Layout/Container',
    component: Container,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
    render: () => (
        <Container className="bg-gray-100 py-10">
            <div className="bg-white p-4 shadow-sm rounded-md">
                I am inside a container with responsive padding and max-width.
            </div>
        </Container>
    ),
};
