import * as React from 'react';
import { cn } from '../../../lib/utils';

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
  )
);
List.displayName = 'List';

const ListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
        className
      )}
      {...props}
    />
  )
);
ListItem.displayName = 'ListItem';

const ListItemIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-center text-gray-500 dark:text-gray-400', className)}
      {...props}
    />
  )
);
ListItemIcon.displayName = 'ListItemIcon';

const ListItemText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  )
);
ListItemText.displayName = 'ListItemText';

const ListItemTitle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('font-medium leading-none', className)} {...props} />
  )
);
ListItemTitle.displayName = 'ListItemTitle';

const ListItemDescription = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('mt-1 text-xs text-muted-foreground', className)} {...props} />
  )
);
ListItemDescription.displayName = 'ListItemDescription';

export {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemTitle,
  ListItemDescription,
};
