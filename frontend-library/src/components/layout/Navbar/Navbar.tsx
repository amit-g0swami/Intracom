import * as React from 'react';
import { cn } from '../../../lib/utils';

const Navbar = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
    <nav
        ref={ref}
        className={cn('flex items-center space-x-4 lg:space-x-6', className)}
        {...props}
    />
));
Navbar.displayName = 'Navbar';

const NavbarItem = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
    <a
        ref={ref}
        className={cn(
            'text-sm font-medium transition-colors hover:text-primary cursor-pointer',
            active ? 'text-gray-950' : 'text-gray-500',
            className
        )}
        {...props}
    />
));
NavbarItem.displayName = 'NavbarItem';

export { Navbar, NavbarItem };
