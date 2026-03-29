import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
    steps: { title: string; description?: string }[];
    currentStep: number;
}

const Stepper = ({ steps, currentStep, className, ...props }: StepperProps) => {
    return (
        <div className={cn('flex w-full items-start', className)} {...props}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                                    isCompleted
                                        ? 'border-primary bg-primary text-white'
                                        : isActive
                                            ? 'border-primary text-primary'
                                            : 'border-gray-200 text-gray-400'
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <div
                                    className={cn(
                                        'text-xs font-semibold',
                                        isActive ? 'text-gray-900' : 'text-gray-500'
                                    )}
                                >
                                    {step.title}
                                </div>
                                {step.description && (
                                    <div className="text-[10px] text-gray-400">
                                        {step.description}
                                    </div>
                                )}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    'mx-2 mt-4 h-[2px] flex-1',
                                    index < currentStep ? 'bg-primary' : 'bg-gray-200'
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export { Stepper };
