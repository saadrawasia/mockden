import db from '@backend/db/client';
import { schemas } from '@backend/db/schema';
import { PROJECT_ID } from '@backend/utils/constants';
import { validateSchemaDefinition } from '@shared/validators/schemaValidator';
import { eq } from 'drizzle-orm';

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

  const existingSchema = await db.query.schemas.findFirst({
    where: fields => eq(fields.name, name),
  });
  if (existingSchema) {
    return { status: 400, json: { message: 'Schema with this name already exist.' } };
  }

  const validate = validateSchemaDefinition(JSON.parse(schema));
  if ('error' in validate) {
    return { status: 400, json: { message: validate.error } };
  }

  const newSchema = await db.insert(schemas).values({ name, fields: JSON.parse(schema), projectId: PROJECT_ID }).returning();
  return { status: 201, json: newSchema };
}

type GetSchemaProps = {
  id: string;
};

export async function getSchemaById({ id }: GetSchemaProps) {
  try {
    const getSchema = await db.query.schemas.findFirst({
      where: fields => eq(fields.id, id),
    });
    if (!getSchema) {
      return { status: 400, json: { message: 'Schema not found.' } };
    }
    return { status: 200, json: getSchema };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Schema not found.' } };
  }
}

export async function getAllSchemas() {
  try {
    const getSchemas = await db.select().from(schemas);
    return { status: 200, json: getSchemas };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Schemas not found.' } };
  }
}

export async function deleteSchema(id: string) {
  try {
    await db.delete(schemas).where(eq(schemas.id, id));
    return { status: 200, json: { message: 'Schema deleted' } };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Schemas not found.' } };
  }
}
