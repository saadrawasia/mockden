import type { Project } from '@shared/lib/types';

import db from '@backend/db/client';
import { projects, schemas } from '@backend/db/schema';
import { slugify } from '@backend/utils/helpers';
import { validateProject } from '@shared/validators/projectValidator';
import { and, eq } from 'drizzle-orm';

type CreateProjectProps = {
	name: Project['name'];
	description: Project['description'];
	userId: number;
};

export async function createProject({ name, description, userId }: CreateProjectProps) {
	if (!name || !description) {
		return { status: 400, json: { message: 'Invalid data.' } };
	}

	const project = validateProject({ name, description });

	if ('error' in project) return { status: 400, json: { message: project.error } };

	const existingProject = await db.query.projects.findFirst({
		where: fields => and(eq(fields.name, name), eq(fields.userId, userId)),
	});
	if (existingProject) {
		return {
			status: 400,
			json: { message: 'Project with this name already exist.' },
		};
	}

	const newProject = await db
		.insert(projects)
		.values({ name, description, userId, slug: slugify(name) })
		.returning();
	return { status: 201, json: newProject[0] };
}

export async function getProjectById(id: number, userId: number) {
	try {
		const getProject = await db.query.projects.findFirst({
			where: fields => and(eq(fields.id, id), eq(fields.userId, userId)),
		});
		if (!getProject) {
			return { status: 400, json: { message: 'Project not found.' } };
		}
		return { status: 200, json: getProject };
	} catch (err) {
		console.error('DB error:', err);
		return { status: 400, json: { message: 'Project not found.' } };
	}
}

export async function getAllProjects(userId: number) {
	try {
		const getProjects = await db.select().from(projects).where(eq(projects.userId, userId));
		return { status: 200, json: getProjects };
	} catch (err) {
		console.error('DB error:', err);
		return { status: 400, json: { message: 'Projects not found.' } };
	}
}

export async function deleteProject(id: number, userId: number) {
	try {
		await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
		return { status: 200, json: { message: 'Project deleted' } };
	} catch (err) {
		console.error('DB error:', err);
		return { status: 400, json: { message: 'Project not found.' } };
	}
}

type EditProjectProps = {
	id: Project['id'];
	name: Project['name'];
	description: Project['description'];
	userId: number;
};

export async function editProject({ id, name, description, userId }: EditProjectProps) {
	const project = validateProject({ name, description });

	if ('error' in project) return { status: 400, json: { message: project.error } };

	const updatedProject = await db
		.update(projects)
		.set({ name, description, slug: slugify(name) })
		.where(and(eq(projects.id, id), eq(projects.userId, userId)))
		.returning();

	return { status: 200, json: updatedProject[0] };
}

type getProjectWithUserAndSchemasProps = {
	projectHeader: string;
	projectSlug: string;
	schemaSlug: string;
};

export async function getProjectWithUserAndSchemas({
	projectHeader,
	projectSlug,
	schemaSlug,
}: getProjectWithUserAndSchemasProps) {
	return await db.query.projects.findFirst({
		where: and(eq(projects.apiKey, projectHeader), eq(projects.slug, projectSlug)),
		with: {
			user: true,
			schemas: {
				where: and(eq(schemas.slug, schemaSlug), eq(schemas.isActive, true)),
			},
		},
	});
}
