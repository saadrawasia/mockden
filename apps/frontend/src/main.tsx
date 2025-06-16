import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';

import '../index.css';

import * as ReactDOM from 'react-dom/client';

import { queryClient } from './lib/queryClient';
import PageNotFound from './pages/pageNotFound';
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree, defaultNotFoundComponent: PageNotFound });

// Register the router instance for type safety
// declare module '@tanstack/react-router' {
//   type Register = {
//     router: typeof router;
//   };
// }

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
