import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

const CollapsibleSection = ({
    title,
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> & {
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <Collapsible className={cn('space-y-2', className)} {...props}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-secondary [&[data-state=open]>svg]:rotate-180">
            {title}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-2 pb-2 pt-1">{children}</div>
        </CollapsibleContent>
    </Collapsible>
);

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleSection };
