import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof Header> = {
    title: 'Layout/Header',
    component: Header,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
    render: () => (
        <Header>
            <div className="font-bold text-xl">MyLib</div>
            <nav className="flex gap-4">
                <Button variant="ghost">Features</Button>
                <Button variant="ghost">Pricing</Button>
                <Button>Get Started</Button>
            </nav>
        </Header>
    ),
};
