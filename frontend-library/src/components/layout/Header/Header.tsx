import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Container } from '../Container';

const Header = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
    <header
        ref={ref}
        className={cn(
            'sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60',
            className
        )}
        {...props}
    >
        <Container className="flex h-16 items-center justify-between">
            {children}
        </Container>
    </header>
));
Header.displayName = 'Header';

export { Header };
