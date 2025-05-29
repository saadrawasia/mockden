import type { Request, Response } from 'express';

import { createSchema, deleteSchema, getAllSchemas, getSchemaById } from '@backend/services/schemaService';

export async function createSchemaRequest(req: Request, res: Response) {
  try {
    const { name, schema } = req.body;
    const newSchema = await createSchema({ name, schema });
    return res.status(newSchema.status).json(newSchema.json);
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
  const schemas = await getSchemaById({ id });
  return res.status(schemas.status).json(schemas.json);
}

export async function deleteSchemaRequest(req: Request, res: Response) {
  const { id } = req.params;
  const schemas = await deleteSchema(id);
  return res.status(schemas.status).json(schemas.json);
}
