import { Suspense } from 'react';

type SuspenseComponentProps = {
  children: React.ReactNode;
};

export default function SuspenseComponent({ children }: SuspenseComponentProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}
