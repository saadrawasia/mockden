import { cn } from '@frontend/lib/utils';

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
};

export function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        'text-balance font-poppins scroll-m-20 text-center text-5xl font-extrabold tracking-tight',
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        'font-poppins scroll-m-20 text-4xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        'font-poppins scroll-m-20 text-3xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className }: TypographyProps) {
  return (
    <h4
      className={cn(
        'font-poppins scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyH5({ children, className }: TypographyProps) {
  return (
    <h5
      className={cn(
        'font-poppins scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h5>
  );
}

export function TypographyP({ children, className }: TypographyProps) {
  return <p className={cn('font-roboto text-base', className)}>{children}</p>;
}

export function TypographyLargeP({ children, className }: TypographyProps) {
  return <p className={cn('font-roboto text-lg', className)}>{children}</p>;
}

export function TypographyCaption({ children, className }: TypographyProps) {
  return <p className={cn('font-roboto text-md', className)}>{children}</p>;
}
