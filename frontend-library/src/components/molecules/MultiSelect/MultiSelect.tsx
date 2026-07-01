import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../atoms/Button';
import { Checkbox } from '../../atoms/Checkbox';
import { Tag } from '../../atoms/Tag';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover';

export interface MultiSelectOption {
    value: string;
    label: string;
}

export interface MultiSelectProps {
    options: MultiSelectOption[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const MultiSelect = ({
    options,
    value: valueProp,
    defaultValue = [],
    onChange,
    placeholder = 'Select items...',
    disabled,
    className,
}: MultiSelectProps) => {
    const [open, setOpen] = React.useState(false);
    const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue);

    const isControlled = valueProp !== undefined;
    const selected = isControlled ? valueProp : uncontrolled;

    const toggle = (optionValue: string) => {
        const next = selected.includes(optionValue)
            ? selected.filter((v) => v !== optionValue)
            : [...selected, optionValue];

        if (!isControlled) {
            setUncontrolled(next);
        }
        onChange?.(next);
    };

    const remove = (optionValue: string) => {
        const next = selected.filter((v) => v !== optionValue);
        if (!isControlled) {
            setUncontrolled(next);
        }
        onChange?.(next);
    };

    const selectedLabels = options.filter((o) => selected.includes(o.value));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'h-auto min-h-9 w-full justify-between font-normal',
                        !selected.length && 'text-[var(--sp-text-muted)]',
                        className
                    )}
                >
                    <span className="flex flex-wrap gap-1 text-left">
                        {selectedLabels.length > 0
                            ? selectedLabels.map((o) => (
                                  <Tag key={o.value} onRemove={() => remove(o.value)}>
                                      {o.label}
                                  </Tag>
                              ))
                            : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-2" align="start">
                <div className="max-h-60 space-y-1 overflow-y-auto">
                    {options.map((option) => {
                        const checked = selected.includes(option.value);
                        return (
                            <label
                                key={option.value}
                                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-secondary"
                            >
                                <Checkbox
                                    checked={checked}
                                    onCheckedChange={() => toggle(option.value)}
                                />
                                <span>{option.label}</span>
                                {checked && <Check className="ml-auto h-4 w-4 text-primary" />}
                            </label>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
};
MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
