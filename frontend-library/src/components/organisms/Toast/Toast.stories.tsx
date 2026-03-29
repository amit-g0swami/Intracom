import type { Meta } from '@storybook/react';
import * as React from 'react';
import {
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from './Toast';
import { Button } from '../../atoms/Button';

const meta: Meta = {
    title: 'Organisms/Toast',
    tags: ['autodocs'],
};

export default meta;

export const Default = {
    render: function Render() {
        const [open, setOpen] = React.useState(false);
        return (
            <ToastProvider>
                <Button
                    variant="outline"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Show Toast
                </Button>
                <Toast open={open} onOpenChange={setOpen}>
                    <div className="grid gap-1">
                        <ToastTitle>Scheduled: Catch up</ToastTitle>
                        <ToastDescription>
                            Friday, February 10, 2023 at 5:57 PM
                        </ToastDescription>
                    </div>
                    <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                    <ToastClose />
                </Toast>
                <ToastViewport />
            </ToastProvider>
        );
    },
};
