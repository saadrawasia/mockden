import { z } from 'zod';

import type { FieldDefinition, SchemaDefinition, SchemaError, ValidationError, ValidationResult } from '../lib/types';

// Zod Schema for Field Definition
const FieldSchema = z.object({
  name: z
    .string()
    .min(1, 'Field name is required')
    .regex(/^[a-z_]\w*$/i, 'Field name must be a valid identifier'),
  type: z.enum(['string', 'number', 'boolean', 'array', 'object'], {
    errorMap: () => ({
      message: 'Type must be one of: string, number, boolean, array, object',
    }),
  }),
  primary: z.boolean().default(false).optional(),
  nullable: z.boolean().default(false).optional(),
  validation: z
    .object({
      // String validations
      minLength: z.number().int().min(0).optional(),
      maxLength: z.number().int().positive().optional(),
      pattern: z.string().optional(), // regex pattern
      format: z.enum(['email', 'url', 'uuid']).optional(),

      // Number validations
      min: z.number().optional(),
      max: z.number().optional(),

      // Array validations
      minItems: z.number().int().min(0).optional(),
      maxItems: z.number().int().positive().optional(),
    })
    .optional(),
  default: z.any().optional(),
}) satisfies z.ZodType<FieldDefinition>;

// Zod Schema for complete Schema Definition
const SchemaDefinitionSchema = z
  .array(FieldSchema)
  .min(1, 'Schema must have at least one field')
  .refine((fields): fields is FieldDefinition[] => {
    // Check for duplicate field names
    const names = fields.map(f => f.name);
    return new Set(names).size === names.length;
  }, 'Duplicate field names are not allowed')
  .refine((fields): fields is FieldDefinition[] => {
    // Ensure exactly one primary key
    const primaryFields = fields.filter(f => f.primary);
    return primaryFields.length === 1;
  }, 'Schema must have exactly one primary key field')
  .refine((fields): fields is FieldDefinition[] => {
    // Ensure exactly one primary key
    const primaryField = fields.filter(f => f.primary)[0];
    return ['string', 'number'].includes(primaryField.type);
  }, 'Primary key field must be type of string or number')
  .refine((fields): fields is FieldDefinition[] => {
    // Validate that minLength <= maxLength
    return fields.every((field) => {
      const val = field.validation;
      if (val?.minLength !== undefined && val?.maxLength !== undefined) {
        return val.minLength <= val.maxLength;
      }
      return true;
    });
  }, 'minLength must be less than or equal to maxLength')
  .refine((fields): fields is FieldDefinition[] => {
    // Validate that min <= max for numbers
    return fields.every((field) => {
      const val = field.validation;
      if (val?.min !== undefined && val?.max !== undefined) {
        return val.min <= val.max;
      }
      return true;
    });
  }, 'min must be less than or equal to max') satisfies z.ZodType<SchemaDefinition>;

// Validate schema definition using Zod
export function validateSchemaDefinition(
  fields: unknown,
): SchemaDefinition | SchemaError {
  try {
    return SchemaDefinitionSchema.parse(fields);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        err => `${err.path.join('.')}: ${err.message}`,
      );

      return { error: `Invalid: ${errorMessages.join(', ')}` };
    }
    return { error: (error as Error).message };
  }
}

// Create dynamic Zod schema from field definitions
function createDynamicZodSchema(
  fields: SchemaDefinition,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    const fieldSchema = createFieldZodSchema(field);
    schemaObject[field.name] = fieldSchema;
  }

  return z.object(schemaObject);
}

// Create Zod schema for individual field
function createFieldZodSchema(field: FieldDefinition): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  // Base type schema
  switch (field.type) {
    case 'string': {
      let stringSchema: z.ZodString = z.string();

      // Apply string validations
      if (field.validation) {
        const val = field.validation;

        if (val.minLength !== undefined) {
          stringSchema = stringSchema.min(
            val.minLength,
            `${field.name} must be at least ${val.minLength} characters`,
          );
        }

        if (val.maxLength !== undefined) {
          stringSchema = stringSchema.max(
            val.maxLength,
            `${field.name} must be at most ${val.maxLength} characters`,
          );
        }

        if (val.pattern) {
          try {
            const regex = new RegExp(val.pattern);
            stringSchema = stringSchema.regex(
              regex,
              `${field.name} format is invalid`,
            );
          }
          catch {
            throw new Error(
              `Invalid regex pattern for field ${field.name}: ${val.pattern}`,
            );
          }
        }

        if (val.format === 'email') {
          stringSchema = stringSchema.email(
            `${field.name} must be a valid email address`,
          );
        }
        else if (val.format === 'url') {
          stringSchema = stringSchema.url(`${field.name} must be a valid URL`);
        }
        else if (val.format === 'uuid') {
          stringSchema = stringSchema.uuid(
            `${field.name} must be a valid UUID`,
          );
        }
      }
      schema = stringSchema;
      break;
    }

    case 'number': {
      let numberSchema: z.ZodNumber = z.number();

      // Apply number validations
      if (field.validation) {
        const val = field.validation;

        if (val.min !== undefined) {
          numberSchema = numberSchema.min(
            val.min,
            `${field.name} must be at least ${val.min}`,
          );
        }

        if (val.max !== undefined) {
          numberSchema = numberSchema.max(
            val.max,
            `${field.name} must be at most ${val.max}`,
          );
        }
      }
      schema = numberSchema;
      break;
    }

    case 'boolean':
      schema = z.boolean();
      break;

    case 'array': {
      let arraySchema: z.ZodArray<z.ZodAny> = z.array(z.any());

      // Apply array validations
      if (field.validation) {
        const val = field.validation;

        if (val.minItems !== undefined) {
          arraySchema = arraySchema.min(
            val.minItems,
            `${field.name} must have at least ${val.minItems} items`,
          );
        }

        if (val.maxItems !== undefined) {
          arraySchema = arraySchema.max(
            val.maxItems,
            `${field.name} must have at most ${val.maxItems} items`,
          );
        }
      }
      schema = arraySchema;
      break;
    }

    case 'object':
      schema = z.object({}).passthrough(); // Allow any object structure
      break;

    default:
      // This should never happen due to Zod validation, but TypeScript doesn't know that
      throw new Error(`Unsupported field type: ${field.type satisfies never}`);
  }

  // Handle nullable fields
  if (field.nullable) {
    schema = schema.nullable();
  }

  // Handle default values
  if (field.default !== undefined) {
    schema = schema.default(field.default);
  }

  // Handle optional fields (if not primary and nullable)
  if (!field.primary && field.nullable) {
    schema = schema.optional();
  }

  return schema;
}

// Validate data against schema using cached Zod schema
export function validateData<T = Record<string, unknown>>(
  data: unknown,
  schemaFields: SchemaDefinition,
): ValidationResult<T> {
  try {
    const zodSchema = createDynamicZodSchema(schemaFields);
    const validatedData = zodSchema.parse(data) as T;

    return {
      isValid: true,
      data: validatedData,
      errors: [],
    };
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      return {
        isValid: false,
        data: null,
        errors,
      };
    }

    return {
      isValid: false,
      data: null,
      errors: [
        {
          field: 'unknown',
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'unknown',
        },
      ],
    };
  }
}
