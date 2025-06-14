import SchemasPage from '@frontend/pages/schemas';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$projectId/schemas')({
  component: SchemasPage,
  loader: async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      projectId: params.projectId,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
});
