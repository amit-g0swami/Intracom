import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from './Sidebar';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof Sidebar> = {
    title: 'Layout/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    render: () => (
        <div className="flex h-[400px] border rounded-md overflow-hidden">
            <Sidebar>
                <SidebarHeader>
                    <span className="font-bold">Dashboard</span>
                </SidebarHeader>
                <SidebarContent>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">Overview</Button>
                        <Button variant="ghost" className="w-full justify-start">Analytics</Button>
                        <Button variant="ghost" className="w-full justify-start">Settings</Button>
                    </div>
                </SidebarContent>
                <SidebarFooter>
                    <Button variant="ghost" className="w-full justify-start">Log out</Button>
                </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-8">
                Main Content Area
            </div>
        </div>
    ),
};
