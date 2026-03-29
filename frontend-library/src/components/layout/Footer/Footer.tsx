import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Container } from '../Container';

const Footer = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
    <footer
        ref={ref}
        className={cn('border-t bg-gray-50/50', className)}
        {...props}
    >
        <Container className="py-12 md:py-16">
            {children}
        </Container>
    </footer>
));
Footer.displayName = 'Footer';

export { Footer };
