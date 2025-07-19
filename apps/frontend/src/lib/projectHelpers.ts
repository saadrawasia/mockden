import type { Project } from '@shared/lib/types';

export function getProjectBySlug(slug: string, projects: Project[]) {
	const project = projects.find(project => project.slug === slug);
	return project;
}
