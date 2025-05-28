import type { Response } from 'express';

import { validateSchemaDefinition } from '@shared/validators/schemaValidator';

import db from '../db/db';

type CreateSchemaProps = {
  name: string;
  schema: string;
  res: Response;
};

export async function createSchema({
  name,
  schema,
  res,
}: CreateSchemaProps) {
  if (!name)
    return res.status(400).json({ message: 'Missing schema name' });
  const existingSchema = await db.get('Select * from schemas where name = ?', [
    name,
  ]);
  if (existingSchema) {
    return res
      .status(400)
      .json({ message: 'schema with this name already exist' });
  }

  const validate = validateSchemaDefinition(JSON.parse(schema));
  if ('error' in validate) {
    return res.status(400).json({ message: validate.error });
  }

  const { lastID } = await db.run(
    'INSERT INTO schemas(name, schema_definition) VALUES(?, ?)',
    [name, schema],
  );

  return res
    .status(201)
    .json({ id: lastID, name, schema_definition: schema });
}

type GetSchemaProps = {
  id: string;
  res: Response;
};

export async function getSchema({ id, res }: GetSchemaProps) {
  try {
    const query = 'SELECT * from schema where id = ?';
    const schema = await db.get(query, [id]);
    return res.json(schema);
  }
  catch (err) {
    console.error('DB error:', err);
    return res.json({ message: 'schema not found' });
  }
}

export async function getAllSchemas(res: Response) {
  try {
    const query = 'Select * from schemas';
    const schemas = await db.all(query);
    return res.json(schemas);
  }
  catch (err) {
    console.error('DB error:', err);
    return res.json({ message: 'schemas not found' });
  }
}
