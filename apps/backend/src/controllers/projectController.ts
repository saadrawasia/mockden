import type { Request, Response } from 'express';

import { createProject, deleteProject, editProject, getAllProjects, getProjectById } from '@backend/services/projectService';

export async function createProjectRequest(req: Request, res: Response) {
  try {
    const { name, description } = req.body;
    const newProject = await createProject({ name, description });
    return res.status(newProject.status).json(newProject.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}

export async function editProjectRequest(req: Request, res: Response) {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    const updatedProject = await editProject({ id, name, description });
    return res.status(updatedProject.status).json(updatedProject.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}

export async function getAllProjectsRequest(_req: Request, res: Response) {
  const projects = await getAllProjects();
  return res.status(projects.status).json(projects.json);
}

export async function getProjectByIdRequest(req: Request, res: Response) {
  const { id } = req.params;
  const project = await getProjectById({ id });
  return res.status(project.status).json(project.json);
}

export async function deleteProjectRequest(req: Request, res: Response) {
  const { id } = req.params;
  const project = await deleteProject(id);
  return res.status(project.status).json(project.json);
}
