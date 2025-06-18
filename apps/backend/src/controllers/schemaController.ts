import type { Request, Response } from 'express';

import {
  createSchema,
  deleteSchema,
  editSchema,
  getAllSchemas,
  getSchemaById,
} from '@backend/services/schemaService';

export async function createSchemaRequest(req: Request, res: Response) {
  try {
    const { name, fields } = req.body;
    const { projectId } = req.params;
    const newSchema = await createSchema({ name, fields, projectId: Number.parseInt(projectId), fakeData: false });
    return res.status(newSchema.status).json(newSchema.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}
export async function editSchemaRequest(req: Request, res: Response) {
  try {
    const { name, fields } = req.body;
    const { projectId, id } = req.params;
    const updatedSchema = await editSchema({ id: Number.parseInt(id), name, fields, fakeData: false, projectId: Number.parseInt(projectId) });
    return res.status(updatedSchema.status).json(updatedSchema.json);
  }
  catch {
    return res.status(400).json({ message: 'Something went wrong.' });
  }
}

export async function getAllSchemasRequest(_req: Request, res: Response) {
  const schemas = await getAllSchemas();
  return res.status(schemas.status).json(schemas.json);
}

export async function getSchemaByIdRequest(req: Request, res: Response) {
  const { id } = req.params;
  const schemas = await getSchemaById(Number.parseInt(id));
  return res.status(schemas.status).json(schemas.json);
}

export async function deleteSchemaRequest(req: Request, res: Response) {
  const { id } = req.params;
  const schemas = await deleteSchema(Number.parseInt(id));
  return res.status(schemas.status).json(schemas.json);
}
