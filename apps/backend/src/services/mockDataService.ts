import type { MockData, SchemaDefinition } from '@shared/lib/types';

import db from '@backend/db/db';
import { validateData } from '@shared/validators/schemaValidator';

import { getSchemaById } from './schemaService';

function generatePrimaryKeyValue(schema: SchemaDefinition, existingData: Array<Record<string, unknown>> = []) {
  const primaryField = schema.find(field => field.primary);
  if (!primaryField) {
    return;
  }

  if (primaryField.type === 'string') {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  else if (primaryField.type === 'number') {
    const maxId = existingData.reduce((max, item) => {
      const data: Record<string, unknown> = item.data ? JSON.parse(item.data as MockData['data']) : {};
      const id = item.data
        ? data[primaryField.name]
        : (typeof item === 'object' && item !== null && !(item as MockData).data
            ? (item as Record<string, unknown>)[primaryField.name]
            : undefined);
      return typeof id === 'number' && id > max ? id : max;
    }, 0);
    return maxId + 1;
  }

  throw new Error('Primary key must be string or number type');
}

export async function getMockData(schemaId: number) {
  try {
    const query = 'Select * from mock_data where schema_id = ?';
    const mockData = (await db.get(query, [schemaId])) as MockData | undefined;
    const data: Record<string, unknown>[] = mockData ? JSON.parse(mockData.data) : [];
    return { status: 200, json: data };
  }
  catch (err) {
    console.error('DB error:', err);
    return { status: 400, json: [] };
  }
}

export async function createMockData(schemaId: string, data: Record<string, unknown>) {
  // Fetch schema and validate existence
  const schemaObj = await getSchemaById({ id: schemaId });
  if (schemaObj.status > 200 || ('message' in schemaObj.json)) {
    return { status: 400, json: { message: `Schema '${schemaId}' not found` } };
  }
  const schema = schemaObj.json;
  const schemaDefinition = schema.schema_definition as SchemaDefinition;

  // Get existing data for auto-increment and sorting
  const existingData = (await getMockData(schema.id)).json;

  // Generate primary key if not provided
  const primaryField = schemaDefinition.find(field => field.primary);
  if (primaryField && !data[primaryField.name]) {
    data[primaryField.name] = generatePrimaryKeyValue(schemaDefinition, existingData);
  }

  // Validate data against schema
  const validation = validateData(data, schemaDefinition);
  if (!validation.isValid) {
    const errorMessages = validation.errors.map(err => `${err.field}: ${err.message}`);
    return { status: 400, json: { message: `Validation failed: ${errorMessages.join(', ')}` } };
  }

  // Prepare new data array (keep max 10, sorted by updated_at)
  const newData = [...existingData, validation.data]
    .slice(-10);

  // Upsert data
  const query = existingData.length > 0
    ? 'UPDATE mock_data SET data = ? WHERE schema_id = ?'
    : 'INSERT INTO mock_data(schema_id, data) VALUES(?, ?)';
  const params = existingData.length > 0
    ? [JSON.stringify(newData), schema.id]
    : [schema.id, JSON.stringify(newData)];
  await db.run(query, params);

  return { status: 200, json: validation.data };
}

export async function deleteMockData(schemaId: string, primaryKeyValue: string) {
  // Fetch schema
  const schemaObj = await getSchemaById({ id: schemaId });
  if (schemaObj.status > 200 || ('message' in schemaObj.json)) {
    return { status: 400, json: { message: `Schema '${schemaId}' not found` } };
  }

  const schema = schemaObj.json;
  const schemaDefinition = schema.schema_definition as SchemaDefinition;

  const primaryField = schemaDefinition.find(field => field.primary)!.name;
  const mockData = (await getMockData(schema.id)).json || [];

  const dataIndex = mockData.findIndex((data: Record<string, unknown>) => data[primaryField] === primaryKeyValue);
  if (dataIndex < 0) {
    return { status: 400, json: { message: `No data found for ${primaryField} with value of ${primaryKeyValue}` } };
  }

  mockData.splice(dataIndex, 1);
  const query = 'UPDATE mock_data SET data = ? WHERE schema_id = ?';
  const params = [JSON.stringify(mockData), schema.id];
  await db.run(query, params);

  return { status: 200, json: { message: 'Data deleted' } };
}

export async function updateMockData(schemaId: string, primaryKeyValue: string, data: Record<string, unknown>) {
  // Fetch schema
  const schemaObj = await getSchemaById({ id: schemaId });
  if (schemaObj.status > 200 || ('message' in schemaObj.json)) {
    return { status: 400, json: { message: `Schema '${schemaId}' not found` } };
  }

  const schema = schemaObj.json;
  const schemaDefinition = schema.schema_definition as SchemaDefinition;

  const primaryField = schemaDefinition.find(field => field.primary)!.name;
  const mockData = (await getMockData(schema.id)).json || [];

  const dataIndex = mockData.findIndex((data: Record<string, unknown>) => data[primaryField] === primaryKeyValue);
  if (dataIndex < 0) {
    return { status: 400, json: { message: `No data found for ${primaryField} with value of ${primaryKeyValue}` } };
  }

  const updatedData = { ...mockData[dataIndex], ...data };

  // Validate data against schema
  const validation = validateData(updatedData, schemaDefinition);
  if (!validation.isValid) {
    const errorMessages = validation.errors.map(err => `${err.field}: ${err.message}`);
    return { status: 400, json: { message: `Validation failed: ${errorMessages.join(', ')}` } };
  }

  mockData[dataIndex] = validation.data!;
  const query = 'UPDATE mock_data SET data = ? WHERE schema_id = ?';
  const params = [JSON.stringify(mockData), schema.id];
  await db.run(query, params);

  return { status: 200, json: validation.data };
}
