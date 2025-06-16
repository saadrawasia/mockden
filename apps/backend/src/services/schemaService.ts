import type { SchemaBase } from '@shared/lib/types';

import db from '@backend/db/client';
import { schemas } from '@backend/db/schema';
import { slugify } from '@backend/utils/helpers';
import { validateSchemaDefinition } from '@shared/validators/schemaValidator';
import { and, eq } from 'drizzle-orm';

type CreateSchemaProps = SchemaBase & {
  projectId: string;
};

export async function createSchema({ name, fields, projectId }: CreateSchemaProps) {
  if (!name)
    return { status: 400, json: { message: 'Missing schema name.' } };

  const existingSchema = await db.query.schemas.findFirst({
    where: fields => eq(fields.name, name),
  });
  if (existingSchema) {
    return {
      status: 400,
      json: { message: 'Schema with this name already exist.' },
    };
  }

  const validate = validateSchemaDefinition(JSON.parse(fields));
  if ('error' in validate) {
    return { status: 400, json: { message: validate.error } };
  }

  const newSchema = await db
    .insert(schemas)
    .values({ name, fields: JSON.parse(fields), projectId })
    .returning();

  const mappedSchema = { ...newSchema[0], slug: slugify(newSchema[0].name), fakeData: false };
  return { status: 201, json: mappedSchema };
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

    const mappedSchema = { ...getSchema, slug: slugify(getSchema.name), fakeData: false };
    return { status: 200, json: mappedSchema };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Schema not found.' } };
  }
}

export async function getAllSchemas() {
  try {
    const getSchemas = await db.select().from(schemas);
    const mappedSchemas = getSchemas.map(schema => ({ ...schema, slug: slugify(schema.name), fakeData: false }));
    return { status: 200, json: mappedSchemas };
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

type EditSchemaProps = SchemaBase & {
  id: string;
  projectId: string;
};

export async function editSchema({ id, name, fields, projectId }: EditSchemaProps) {
  if (!name)
    return { status: 400, json: { message: 'Missing schema name.' } };

  const validate = validateSchemaDefinition(JSON.parse(fields));
  if ('error' in validate) {
    return { status: 400, json: { message: validate.error } };
  }

  const updatedSchema = await db
    .update(schemas)
    .set({ name, fields })
    .where(
      and(eq(schemas.id, id), eq(schemas.projectId, projectId)),
    )
    .returning();

  const mappedSchema = { ...updatedSchema[0], slug: slugify(updatedSchema[0].name), fakeData: false };

  return { status: 200, json: mappedSchema };
}
