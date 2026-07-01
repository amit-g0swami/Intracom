import * as React from 'react';
import { Upload } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface FileUploadProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    onChange?: (files: FileList | null) => void;
    hint?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
    ({ className, onChange, hint = 'Drag and drop or click to upload', disabled, ...props }, ref) => {
        const inputRef = React.useRef<HTMLInputElement>(null);
        const [dragging, setDragging] = React.useState(false);

        React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        const handleFiles = (files: FileList | null) => {
            onChange?.(files);
        };

        return (
            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        inputRef.current?.click();
                    }
                }}
                onClick={() => !disabled && inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    if (!disabled) {
                        handleFiles(e.dataTransfer.files);
                    }
                }}
                className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-secondary/30 px-6 py-10 text-center transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    dragging && 'border-primary bg-secondary/60',
                    disabled && 'cursor-not-allowed opacity-50',
                    className
                )}
            >
                <Upload className="mb-3 h-8 w-8 text-[var(--sp-text-muted)]" />
                <p className="text-sm font-medium text-foreground">{hint}</p>
                <p className="mt-1 text-xs text-[var(--sp-text-muted)]">
                    PDF, PNG, JPG up to 10MB
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    className="sr-only"
                    disabled={disabled}
                    onChange={(e) => handleFiles(e.target.files)}
                    {...props}
                />
            </div>
        );
    }
);
FileUpload.displayName = 'FileUpload';

export { FileUpload };
