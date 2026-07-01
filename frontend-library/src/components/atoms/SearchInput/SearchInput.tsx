import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface SearchInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, onClear, ...props }, ref) => {
        return (
            <div className="relative">
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sp-text-muted)]"
                    aria-hidden
                />
                <input
                    ref={ref}
                    type="search"
                    className={cn(
                        'flex h-9 w-full rounded-md border border-input bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-[var(--sp-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                    {...props}
                    onChange={(e) => {
                        props.onChange?.(e);
                        if (!e.target.value) {
                            onClear?.();
                        }
                    }}
                />
            </div>
        );
    }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
