import type { Request, Response } from 'express';

import {
  createProject,
  deleteProject,
  editProject,
  getAllProjects,
  getProjectById,
} from '@backend/services/projectService';
import { getUserByClerkId } from '@backend/services/userService';
import { getAuth } from '@clerk/express';

async function getAuthenticatedUser(req: Request) {
  const { userId } = getAuth(req);
  if (!userId) {
    return null;
  }
  const user = await getUserByClerkId(userId);
  if (!user) {
    return null;
  }
  return user;
}

export async function createProjectRequest(req: Request, res: Response) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user)
      return res.status(401).json({ message: 'Unauthorized Request' }); ;
    const { name, description } = req.body;
    const newProject = await createProject({ name, description, userId: user.id });
    return res.status(newProject.status).json(newProject.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}

export async function editProjectRequest(req: Request, res: Response) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user)
      return res.status(401).json({ message: 'Unauthorized Request' }); ;
    const { name, description } = req.body;
    const { id } = req.params;
    const updatedProject = await editProject({
      id: Number.parseInt(id),
      name,
      description,
      userId: user.id,
    });
    return res.status(updatedProject.status).json(updatedProject.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}

export async function getAllProjectsRequest(req: Request, res: Response) {
  const user = await getAuthenticatedUser(req);
  if (!user)
    return res.status(401).json({ message: 'Unauthorized Request' }); ;
  const projects = await getAllProjects(user.id);
  return res.status(projects.status).json(projects.json);
}

export async function getProjectByIdRequest(req: Request, res: Response) {
  const user = await getAuthenticatedUser(req);
  if (!user)
    return res.status(401).json({ message: 'Unauthorized Request' }); ;
  const { id } = req.params;
  const project = await getProjectById(Number.parseInt(id), user.id);
  return res.status(project.status).json(project.json);
}

export async function deleteProjectRequest(req: Request, res: Response) {
  const user = await getAuthenticatedUser(req);
  if (!user)
    return res.status(401).json({ message: 'Unauthorized Request' }); ;
  const { id } = req.params;
  const project = await deleteProject(Number.parseInt(id), user.id);
  return res.status(project.status).json(project.json);
}
