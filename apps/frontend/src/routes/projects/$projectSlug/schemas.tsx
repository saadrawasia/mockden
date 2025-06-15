import { getProjectBySlug } from '@frontend/lib/projectHelpers';
import PageNotFound from '@frontend/pages/pageNotFound';
import SchemasPage from '@frontend/pages/schemas';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$projectSlug/schemas')({
  component: SchemasPage,
  loader: async ({ params }) => {
    const project = getProjectBySlug(params.projectSlug);
    if (!project) {
      throw notFound();
    }
    return {
      projectSlug: params.projectSlug,
      project,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
  notFoundComponent: PageNotFound,
});
