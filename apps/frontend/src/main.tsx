import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import '../index.css';
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
    <RouterProvider router={router} />
  </StrictMode>,
);
