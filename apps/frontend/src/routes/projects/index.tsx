import ProjectsPage from '@frontend/pages/projects';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
});
