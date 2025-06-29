import { cn } from '@frontend/lib/utils';
import type * as React from 'react';

export type InputProps = {
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
} & React.ComponentProps<'input'>;

function Input({ className, type, startIcon, endIcon, ...props }: InputProps) {
	return (
		<div className={cn('relative', className)}>
			{startIcon && (
				<div className="-translate-y-1/2 absolute top-1/2 left-0 flex items-center gap-x-1 pl-3">
					{startIcon}
				</div>
			)}

			<input
				type={type}
				data-slot="input"
				className={cn(
					'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
					'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
					'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
					className,
					{
						'pr-10': endIcon,
						'pl-12': startIcon,
					}
				)}
				{...props}
			/>
			{endIcon && (
				<div className="-translate-y-1/2 absolute top-1/2 right-0 flex items-center gap-x-1 pr-3">
					{endIcon}
				</div>
			)}
		</div>
	);
}

export { Input };
