import type { Schema } from '@shared/lib/types';

import { validateSchemaDefinition } from '@shared/validators/schemaValidator';

import db from '../db/db';

type CreateSchemaProps = {
  name: string;
  schema: string;
};

export async function createSchema({
  name,
  schema,
}: CreateSchemaProps) {
  if (!name)
    return { status: 400, json: { message: 'Missing schema name.' } };
  const existingSchema = await db.get('Select * from schemas where name = ?', [
    name,
  ]);
  if (existingSchema) {
    return { status: 400, json: { message: 'Schema with this name already exist.' } };
  }

  const validate = validateSchemaDefinition(JSON.parse(schema));
  if ('error' in validate) {
    return { status: 400, json: { message: validate.error } };
  }

  const { lastID } = await db.run(
    'INSERT INTO schemas(name, schema_definition) VALUES(?, ?)',
    [name, schema],
  );
  return { status: 201, json: { id: lastID, name, schema_definition: JSON.parse(schema) } };
}

type GetSchemaProps = {
  id: string;
};

export async function getSchemaById({ id }: GetSchemaProps) {
  try {
    const query = 'SELECT * from schemas where id = ?';
    const schema = await db.get(query, [id]) as Schema;
    return { status: 200, json: mapSchema(schema) };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Schema not found.' } };
  }
}

export async function getAllSchemas() {
  try {
    const query = 'Select * from schemas';
    const schemas = await db.all(query) as Schema[];
    return { status: 200, json: mapSchemas(schemas) };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Schemas not found.' } };
  }
}

function mapSchemas(schemas: Schema[]) {
  return schemas.map(schema => mapSchema(schema));
}

function mapSchema(schema: Schema) {
  return { ...schema, schema_definition: JSON.parse(schema.schema_definition) };
}
