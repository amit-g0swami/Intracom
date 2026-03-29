import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
    title: 'Layout/Footer',
    component: Footer,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
    render: () => (
        <Footer>
            <div className="flex flex-col md:flex-row justify-between gap-8">
                <div>
                    <div className="font-bold text-xl mb-4">MyLib</div>
                    <p className="text-sm text-gray-500 max-w-[200px]">
                        Building the next generation of component libraries.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-16">
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Features</li>
                            <li>Pricing</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>About</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t text-sm text-gray-500">
                © 2024 MyLib Inc. All rights reserved.
            </div>
        </Footer>
    ),
};
