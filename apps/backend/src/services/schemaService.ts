import type { SchemaBase } from '@shared/lib/types';

import db from '@backend/db/client';
import { schemas } from '@backend/db/schema';
import { slugify } from '@backend/utils/helpers';
import { validateSchemaDefinition } from '@shared/validators/schemaValidator';
import { and, eq } from 'drizzle-orm';

type CreateSchemaProps = SchemaBase & {
  projectId: string;
};

export async function createSchema({ name, fields, projectId, fakeData }: CreateSchemaProps) {
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
    .values({ name, fields: JSON.parse(fields), projectId, fakeData, slug: slugify(name) })
    .returning();

  return { status: 201, json: newSchema[0] };
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

type EditSchemaProps = SchemaBase & {
  id: string;
  projectId: string;
};

export async function editSchema({ id, name, fields, projectId, fakeData }: EditSchemaProps) {
  if (!name)
    return { status: 400, json: { message: 'Missing schema name.' } };

  const validate = validateSchemaDefinition(JSON.parse(fields));
  if ('error' in validate) {
    return { status: 400, json: { message: validate.error } };
  }

  const updatedSchema = await db
    .update(schemas)
    .set({ name, fields: JSON.parse(fields), slug: slugify(name), fakeData })
    .where(
      and(eq(schemas.id, id), eq(schemas.projectId, projectId)),
    )
    .returning();

  return { status: 200, json: updatedSchema[0] };
}
