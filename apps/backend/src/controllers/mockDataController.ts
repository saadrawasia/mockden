import type { Request, Response } from 'express';

import {
  createMockData,
  deleteMockData,
  getMockData,
  updateMockData,
} from '@backend/services/mockDataService';

export async function getMockDataRequest(req: Request, res: Response) {
  const { schemaId } = req.params;
  const mockData = await getMockData(Number.parseInt(schemaId));
  return res.status(mockData.status).json(mockData.json);
}

export async function createMockDataRequest(req: Request, res: Response) {
  try {
    const { schemaId } = req.params;
    const { data } = req.body;
    if (!data) {
      return res.status(400).json('Data is missing.');
    }
    const mockData = await createMockData(Number.parseInt(schemaId), data);
    return res.status(mockData.status).json(mockData.json);
  }
  catch (e) {
    console.log('error', (e as Error).message);
    return res.status(400).json('Something went wrong');
  }
}

export async function updateMockDataRequest(req: Request, res: Response) {
  try {
    const { schemaId, primaryKeyValue } = req.params;
    const { data } = req.body;
    if (!data) {
      return res.status(400).json('Data is missing.');
    }
    const mockData = await updateMockData(Number.parseInt(schemaId), primaryKeyValue, data);
    return res.status(mockData.status).json(mockData.json);
  }
  catch (e) {
    console.log('error', (e as Error).message);
    return res.status(400).json('Something went wrong');
  }
}

export async function deleteMockDataRequest(req: Request, res: Response) {
  try {
    const { schemaId, primaryKeyValue } = req.params;
    const mockData = await deleteMockData(Number.parseInt(schemaId), primaryKeyValue);
    return res.status(mockData.status).json(mockData.json);
  }
  catch (e) {
    console.log('error', (e as Error).message);
    return res.status(400).json('Something went wrong');
  }
}
