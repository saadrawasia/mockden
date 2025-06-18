import type { Project, Schema } from '@shared/lib/types';

import db from '@backend/db/client';
import { schemas } from '@backend/db/schema';
import { slugify } from '@backend/utils/helpers';
import { validateSchemaDefinition } from '@shared/validators/schemaValidator';
import { and, eq } from 'drizzle-orm';

import { createMockDataArray, deleteMockDataEntry } from './mockDataService';

type CreateSchemaProps = {
  projectId: Project['id'];
  name: Schema['name'];
  fields: Schema['fields'];
  fakeData: Schema['fakeData'];
  isActive?: Schema['isActive'];
};

export async function createSchema({ name, fields, projectId, fakeData, isActive = true }: CreateSchemaProps) {
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
    .values({ name, fields: JSON.parse(fields), projectId, fakeData, slug: slugify(name), isActive })
    .returning();

  if (fakeData) {
    await createMockDataArray(newSchema[0].id);
  }

  return { status: 201, json: newSchema[0] };
}

export async function getSchemaById(id: number) {
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

export async function deleteSchema(id: number) {
  try {
    await db.delete(schemas).where(eq(schemas.id, id));
    return { status: 200, json: { message: 'Schema deleted' } };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: { message: 'Schemas not found.' } };
  }
}

type EditSchemaProps = {
  id: Schema['id'];
  projectId: Project['id'];
  name: Schema['name'];
  fields: Schema['fields'];
  fakeData: Schema['fakeData'];
  isActive?: Schema['isActive'];
};

export async function editSchema({ id, name, fields, projectId, fakeData, isActive }: EditSchemaProps) {
  if (!name)
    return { status: 400, json: { message: 'Missing schema name.' } };

  const mappedFields = Array.isArray(fields) ? fields : JSON.parse(fields);

  const schema = await getSchemaById(id);

  const validate = validateSchemaDefinition(mappedFields);
  if ('error' in validate) {
    return { status: 400, json: { message: validate.error } };
  }

  const updatedSchema = await db
    .update(schemas)
    .set({ name, fields: mappedFields, slug: slugify(name), fakeData, isActive })
    .where(
      and(eq(schemas.id, id), eq(schemas.projectId, projectId)),
    )
    .returning();

  if (!('message' in schema.json) && JSON.stringify(schema.json.fields) !== JSON.stringify(mappedFields)) {
    await deleteMockDataEntry(id);

    if (fakeData) {
      await createMockDataArray(id);
    }
  }

  return { status: 200, json: updatedSchema[0] };
}
