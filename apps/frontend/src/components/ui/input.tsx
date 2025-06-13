import { cn } from '@frontend/lib/utils';
import * as React from 'react';

export type InputProps = {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
} & React.ComponentProps<'input'>;

function Input({ className, type, startIcon, endIcon, ...props }: InputProps) {
  return (
    <div className={cn('relative', className)}>
      {startIcon && (
        <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-x-1 pl-3">
          {startIcon}
        </div>
      )}

      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
          {
            'pr-10': endIcon,
            'pl-12': startIcon,
          },
        )}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-x-1 pr-3">
          {endIcon}
        </div>
      )}
    </div>
  );
}

export { Input };
