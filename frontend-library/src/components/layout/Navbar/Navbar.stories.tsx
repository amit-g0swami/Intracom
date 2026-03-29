import type { Meta, StoryObj } from '@storybook/react';
import { Navbar, NavbarItem } from './Navbar';

const meta: Meta<typeof Navbar> = {
    title: 'Layout/Navbar',
    component: Navbar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
    render: () => (
        <Navbar>
            <NavbarItem active href="#">Dashboard</NavbarItem>
            <NavbarItem href="#">Projects</NavbarItem>
            <NavbarItem href="#">Tasks</NavbarItem>
            <NavbarItem href="#">Settings</NavbarItem>
        </Navbar>
    ),
};
