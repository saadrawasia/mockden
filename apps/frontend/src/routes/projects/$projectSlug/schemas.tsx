import type { Project } from '@shared/lib/types';

import config from '@frontend/lib/config';
import { getProjectBySlug } from '@frontend/lib/projectHelpers';
import { queryClient } from '@frontend/lib/queryClient';
import PageNotFound from '@frontend/pages/pageNotFound';
import SchemasPage from '@frontend/pages/schemas';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$projectSlug/schemas')({
  component: SchemasPage,
  loader: async ({ params }) => {
    const projects = queryClient.getQueryData<Project[]>(['projects']);

    // If not cached, optionally load them
    if (!projects) {
      await queryClient.ensureQueryData({
        queryKey: ['projects'],
        queryFn: async () => {
          const res = await fetch(`${config.BACKEND_URL}/projects`);
          if (!res.ok)
            throw new Error('Failed to load projects');
          return res.json();
        },
      });
    }

    const allProjects = queryClient.getQueryData<Project[]>(['projects']) ?? [];
    const project = getProjectBySlug(params.projectSlug, allProjects);
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
