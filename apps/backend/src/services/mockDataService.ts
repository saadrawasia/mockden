import type { SchemaDefinition } from '@shared/lib/types';

import db from '@backend/db/client';
import { mockData as mockDataSchema } from '@backend/db/schema';
import { validateData } from '@shared/validators/schemaValidator';
import { eq } from 'drizzle-orm';

import { getSchemaById } from './schemaService';

/**
 * Generates a primary key value based on schema definition and existing data.
 */
function generatePrimaryKeyValue(
  schema: SchemaDefinition,
  existingData: Array<Record<string, unknown>> = [],
) {
  const primaryField = schema.find(field => field.primary);
  if (!primaryField)
    return;

  if (primaryField.type === 'string') {
    if (
      typeof crypto !== 'undefined'
      && typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  if (primaryField.type === 'number') {
    let maxId = 0;
    for (const item of existingData) {
      const value = (item as Record<string, unknown>)[primaryField.name];
      if (typeof value === 'number' && value > maxId) {
        maxId = value;
      }
    }
    return maxId + 1;
  }

  throw new Error('Primary key must be string or number type');
}

/**
 * Gets mock data for a schema.
 */
export async function getMockData<T = Record<string, unknown>[]>(
  schemaId: number,
): Promise<{ status: number; json: T }> {
  try {
    const mockData = await db.query.mockData.findFirst({
      where: fields => eq(fields.schemaId, schemaId),
    });
    const data = mockData ? (mockData.data as T) : ([] as T);
    return { status: 200, json: data };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: [] as T };
  }
}

/**
 * Creates new mock data or updates if primary key exists.
 */
export async function createMockData(
  schemaId: number,
  data: Record<string, unknown>,
) {
  // Fetch schema and validate existence
  const schemaObj = await getSchemaById(schemaId);
  if (schemaObj.status > 200 || 'message' in schemaObj.json) {
    return { status: 400, json: { message: `Schema '${schemaId}' not found` } };
  }
  const schema = schemaObj.json;
  const schemaDefinition = schema.fields as SchemaDefinition;

  // Get existing data for auto-increment and sorting
  const existingData = (await getMockData<Record<string, unknown>[]>(schema.id))
    .json;

  // Generate primary key if not provided
  const primaryField = schemaDefinition.find(field => field.primary);
  if (primaryField && !data[primaryField.name]) {
    data[primaryField.name] = generatePrimaryKeyValue(
      schemaDefinition,
      existingData,
    );
  }
  if (primaryField) {
    const dataIndex = existingData.findIndex(
      (eData: Record<string, unknown>) =>
        data[primaryField.name] === eData[primaryField.name],
    );
    if (dataIndex > -1) {
      return updateMockData(schemaId, data[primaryField.name] as string, data);
    }
  }

  // Validate data against schema
  const validation = validateData(data, schemaDefinition);
  if (!validation.isValid) {
    const errorMessages = validation.errors.map(
      err => `${err.field}: ${err.message}`,
    );
    return {
      status: 400,
      json: { message: `Validation failed: ${errorMessages.join(', ')}` },
    };
  }

  // Prepare new data array (keep max 10)
  const newData = [...existingData, validation.data].slice(-10);

  if (existingData.length > 0) {
    await db
      .update(mockDataSchema)
      .set({ data: newData })
      .where(eq(mockDataSchema.schemaId, schema.id));
  }
  else {
    await db
      .insert(mockDataSchema)
      .values({ schemaId: schema.id, data: newData });
  }

  return { status: 200, json: validation.data };
}

/**
 * Deletes mock data by primary key value.
 */
export async function deleteMockData(
  schemaId: number,
  primaryKeyValue: string,
) {
  // Fetch schema
  const schemaObj = await getSchemaById(schemaId);
  if (schemaObj.status > 200 || 'message' in schemaObj.json) {
    return { status: 400, json: { message: `Schema '${schemaId}' not found` } };
  }

  const schema = schemaObj.json;
  const schemaDefinition = schema.fields as SchemaDefinition;
  const primaryField = schemaDefinition.find(field => field.primary)!.name;
  const mockData
    = (await getMockData<Record<string, unknown>[]>(schema.id)).json || [];

  const dataIndex = mockData.findIndex(
    (data: Record<string, unknown>) => data[primaryField] === primaryKeyValue,
  );
  if (dataIndex < 0) {
    return {
      status: 400,
      json: {
        message: `No data found for ${primaryField} with value of ${primaryKeyValue}`,
      },
    };
  }

  mockData.splice(dataIndex, 1);

  await db
    .update(mockDataSchema)
    .set({ data: mockData })
    .where(eq(mockDataSchema.schemaId, schema.id));

  return { status: 200, json: { message: 'Data deleted' } };
}

/**
 * Updates mock data by primary key value.
 */
export async function updateMockData(
  schemaId: number,
  primaryKeyValue: string,
  data: Record<string, unknown>,
) {
  // Fetch schema
  const schemaObj = await getSchemaById(schemaId);
  if (schemaObj.status > 200 || 'message' in schemaObj.json) {
    return { status: 400, json: { message: `Schema '${schemaId}' not found` } };
  }

  const schema = schemaObj.json;
  const schemaDefinition = schema.fields as SchemaDefinition;
  const primaryField = schemaDefinition.find(field => field.primary)!.name;
  const mockData
    = (await getMockData<Record<string, unknown>[]>(schema.id)).json || [];

  const dataIndex = mockData.findIndex(
    (item: Record<string, unknown>) => item[primaryField] === primaryKeyValue,
  );
  if (dataIndex < 0) {
    return {
      status: 400,
      json: {
        message: `No data found for ${primaryField} with value of ${primaryKeyValue}`,
      },
    };
  }

  const updatedData = { ...mockData[dataIndex], ...data };

  // Validate data against schema
  const validation = validateData(updatedData, schemaDefinition);
  if (!validation.isValid) {
    const errorMessages = validation.errors.map(
      err => `${err.field}: ${err.message}`,
    );
    return {
      status: 400,
      json: { message: `Validation failed: ${errorMessages.join(', ')}` },
    };
  }

  mockData[dataIndex] = validation.data!;

  await db
    .update(mockDataSchema)
    .set({ data: mockData })
    .where(eq(mockDataSchema.schemaId, schema.id));

  return { status: 200, json: validation.data };
}
