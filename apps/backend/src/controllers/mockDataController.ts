import type { Request, Response } from 'express';

import {
  createMockData,
  deleteMockData,
  getMockData,
  updateMockData,
} from '@backend/services/mockDataService';
import { getProjectWithUserAndSchemas } from '@backend/services/projectService';

export async function getMockDataRequest(req: Request, res: Response) {
  const projectHeader = req.headers['x-mockden-header'] as string;
  const { projectSlug, schemaSlug } = req.params;

  const project = await getProjectWithUserAndSchemas({ projectHeader, projectSlug, schemaSlug });

  if (project?.schemas.length === 0 || project?.schemas[0].id === undefined) {
    return res.status(404).json({ message: 'Project or schema not found.' });
  }

  const mockData = await getMockData(project.schemas[0].id);
  return res.status(mockData.status).json(mockData.json);
}

export async function createMockDataRequest(req: Request, res: Response) {
  try {
    const projectHeader = req.headers['x-mockden-header'] as string;
    const { projectSlug, schemaSlug } = req.params;

    const project = await getProjectWithUserAndSchemas({ projectHeader, projectSlug, schemaSlug });

    if (project?.schemas.length === 0 || project?.schemas[0].id === undefined) {
      return res.status(404).json({ message: 'Project or schema not found.' });
    }
    const { data } = req.body;
    if (!data) {
      return res.status(400).json('Data is missing.');
    }
    const planTier: 'free' | 'pro' = project.user.planTier === 'pro' ? 'pro' : 'free';
    const mockData = await createMockData(project.schemas[0].id, data, planTier);
    return res.status(mockData.status).json(mockData.json);
  }
  catch (e) {
    console.log('error', (e as Error).message);
    return res.status(400).json('Something went wrong');
  }
}

export async function updateMockDataRequest(req: Request, res: Response) {
  try {
    const projectHeader = req.headers['x-mockden-header'] as string;
    const { projectSlug, schemaSlug } = req.params;

    const project = await getProjectWithUserAndSchemas({ projectHeader, projectSlug, schemaSlug });

    if (project?.schemas.length === 0 || project?.schemas[0].id === undefined) {
      return res.status(404).json({ message: 'Project or schema not found.' });
    }
    const { primaryKeyValue } = req.params;
    const { data } = req.body;
    if (!data) {
      return res.status(400).json('Data is missing.');
    }
    const mockData = await updateMockData(project.schemas[0].id, primaryKeyValue, data);
    return res.status(mockData.status).json(mockData.json);
  }
  catch (e) {
    console.log('error', (e as Error).message);
    return res.status(400).json('Something went wrong');
  }
}

export async function deleteMockDataRequest(req: Request, res: Response) {
  try {
    const projectHeader = req.headers['x-mockden-header'] as string;
    const { projectSlug, schemaSlug } = req.params;

    const project = await getProjectWithUserAndSchemas({ projectHeader, projectSlug, schemaSlug });

    if (project?.schemas.length === 0 || project?.schemas[0].id === undefined) {
      return res.status(404).json({ message: 'Project or schema not found.' });
    }
    const { primaryKeyValue } = req.params;
    const mockData = await deleteMockData(project.schemas[0].id, primaryKeyValue);
    return res.status(mockData.status).json(mockData.json);
  }
  catch (e) {
    console.log('error', (e as Error).message);
    return res.status(400).json('Something went wrong');
  }
}
