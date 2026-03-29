import * as React from 'react';
import { cn } from '../../../lib/utils';

const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <aside
        ref={ref}
        className={cn(
            'hidden border-r bg-gray-50/50 lg:block lg:w-64 xl:w-72',
            className
        )}
        {...props}
    >
        <div className="flex h-full flex-col gap-2 p-4">
            {children}
        </div>
    </aside>
));
Sidebar.displayName = 'Sidebar';

const SidebarHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex h-14 items-center border-b px-2', className)} {...props} />
);

const SidebarContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex-1 overflow-auto py-2', className)} {...props} />
);

const SidebarFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex h-14 items-center border-t px-2', className)} {...props} />
);

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter };
