import Navbar from './components/navbar/navbar';
import { Toaster } from './components/ui/sonner';

type PageShellProps = {
  children: React.ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-dvh flex w-full max-w-7xl flex-col gap-8 justify-self-center px-6 py-3 md:gap-16 md:px-12 md:py-6">
      <Navbar />
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            description: '!text-neutral-900',
          },
        }}
      />
    </div>
  );
}
