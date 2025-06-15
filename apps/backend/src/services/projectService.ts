import type { ProjectBase } from '@shared/lib/types';

import db from '@backend/db/client';
import { projects } from '@backend/db/schema';
import { USER_ID } from '@backend/utils/constants';
import { slugify } from '@backend/utils/helpers';
import { validateProject } from '@shared/validators/projectValidator';
import { eq } from 'drizzle-orm';

type CreateProjectProps = ProjectBase;

export async function createProject({ name, description }: CreateProjectProps) {
  const project = validateProject({ name, description });

  if ('error' in project)
    return { status: 400, json: { message: project.error } };

  const existingProject = await db.query.projects.findFirst({
    where: fields => eq(fields.name, name),
  });
  if (existingProject) {
    return {
      status: 400,
      json: { message: 'Project with this name already exist.' },
    };
  }

  const newProject = await db
    .insert(projects)
    .values({ name, description, userId: USER_ID, slug: slugify(name) })
    .returning();
  return { status: 201, json: newProject[0] };
}

type GetProjectProps = {
  id: string;
};

export async function getProjectById({ id }: GetProjectProps) {
  try {
    const getProject = await db.query.projects.findFirst({
      where: fields => eq(fields.id, id),
    });
    if (!getProject) {
      return { status: 400, json: { message: 'Project not found.' } };
    }
    return { status: 200, json: getProject };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Project not found.' } };
  }
}

export async function getAllProjects() {
  try {
    const getProjects = await db.select().from(projects);
    return { status: 200, json: getProjects };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Projects not found.' } };
  }
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    return { status: 200, json: { message: 'Project deleted' } };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Project not found.' } };
  }
}

type EditProjectProps = ProjectBase & {
  id: string;
};

export async function editProject({ id, name, description }: EditProjectProps) {
  const project = validateProject({ name, description });

  if ('error' in project)
    return { status: 400, json: { message: project.error } };

  const updatedProject = await db
    .update(projects)
    .set({ name, description, slug: slugify(name) })
    .where(eq(projects.id, id))
    .returning();

  return { status: 200, json: updatedProject[0] };
}
