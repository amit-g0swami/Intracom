import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta: Meta<typeof Tabs> = {
    title: 'Molecules/Tabs',
    component: Tabs,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    render: () => (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Account</h3>
                    <p className="text-sm text-gray-500">Make changes to your account here.</p>
                </div>
            </TabsContent>
            <TabsContent value="password">
                <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <p className="text-sm text-gray-500">Change your password here.</p>
                </div>
            </TabsContent>
        </Tabs>
    ),
};
