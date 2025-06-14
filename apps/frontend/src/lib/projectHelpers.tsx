import { useProjectStore } from '@frontend/stores/projectStore';

export function getProjectBySlug(slug: string) {
  const projects = useProjectStore.getState().projects;
  const project = projects.find(project => project.slug === slug);
  return project;
}
