import { z } from 'zod';

import type {
	FieldDefinition,
	SchemaBase,
	SchemaDefinition,
	ValidationError,
	ValidationResult,
} from '../lib/types';

const fieldTypeEnum = z.enum(
	['string', 'number', 'boolean', 'array', 'object', 'date', 'url', 'uuid', 'email'],
	{
		errorMap: () => ({
			message:
				'Type must be one of: string, number, boolean, array, object, date, url, uuid or email',
		}),
	}
);

export type FieldType = z.infer<typeof fieldTypeEnum>;

// Zod Schema for Field Definition
const FieldSchema = z
	.object({
		name: z
			.string({
				errorMap: () => ({
					message: 'Field name is required',
				}),
			})
			.min(1, 'Field name is required')
			.regex(/^[a-z]*$/i, 'Field name must contain only lowercase letters'),
		type: fieldTypeEnum,
		items: z
			.object({
				type: fieldTypeEnum,
				enum: z.array(z.unknown()).optional(),
			})
			.optional()
			.superRefine((val, ctx) => {
				if (!val || !val.enum) return;

				let isValid = true;
				switch (val.type) {
					case 'string':
					case 'url':
					case 'uuid':
					case 'email':
						isValid = val.enum.every((v: unknown) => typeof v === 'string');
						break;
					case 'number':
						isValid = val.enum.every((v: unknown) => typeof v === 'number');
						break;
					case 'boolean':
						isValid = val.enum.every((v: unknown) => typeof v === 'boolean');
						break;
					case 'date':
						isValid = val.enum.every((v: unknown) => typeof v === 'string' || v instanceof Date);
						break;
					case 'array':
						isValid = val.enum.every((v: unknown) => Array.isArray(v));
						break;
					case 'object':
						isValid = val.enum.every(
							(v: unknown) => typeof v === 'object' && !Array.isArray(v) && v !== null
						);
						break;
					default:
						isValid = true;
				}

				if (!isValid) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Enum values must match the type of items.type',
						path: ['enum'],
					});
				}
			}),
		fields: z.array(z.lazy((): z.ZodType<FieldDefinition> => FieldSchema)).optional(), // Only required for type: 'object'
		primary: z.boolean().default(false).optional(),
		nullable: z.boolean().default(false).optional(),
		validation: z
			.object({
				// String validations
				minLength: z.number().int().min(0).optional(),
				maxLength: z.number().int().positive().optional(),
				pattern: z.string().optional(), // regex pattern

				// Number validations
				min: z.number().optional(),
				max: z.number().optional(),

				// Array validations
				minItems: z.number().int().min(0).optional(),
				maxItems: z.number().int().positive().optional(),
			})
			.optional(),
		default: z.any().optional(),
	})
	.superRefine((data, ctx) => {
		// The name check is redundant since we already have .min(1) on the name field
		// but keeping it for extra safety
		if (!data.name || data.name.trim() === '') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Field name is required and cannot be empty',
				path: ['name'],
			});
		}

		// Only string, number, and uuid can be primary
		if (data.primary && !['string', 'number', 'uuid'].includes(data.type)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Only string, number, and uuid types can be primary keys',
				path: ['primary'],
			});
		}

		// Validation rules based on type
		if (data.validation) {
			const { min, max, minLength, maxLength, pattern, minItems, maxItems } = data.validation;

			// min/max only for number and date
			if ((min !== undefined || max !== undefined) && !['number', 'date'].includes(data.type)) {
				if (min !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `'min' validation rule is only allowed for number and date types, but field type is '${data.type}'`,
						path: ['validation', 'min'],
					});
				}
				if (max !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `'max' validation rule is only allowed for number and date types, but field type is '${data.type}'`,
						path: ['validation', 'max'],
					});
				}
			}

			// minLength/maxLength/pattern only for string
			if (
				(minLength !== undefined || maxLength !== undefined || pattern !== undefined) &&
				data.type !== 'string'
			) {
				if (minLength !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `'minLength' validation rule is only allowed for string type, but field type is '${data.type}'`,
						path: ['validation', 'minLength'],
					});
				}
				if (maxLength !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `'maxLength' validation rule is only allowed for string type, but field type is '${data.type}'`,
						path: ['validation', 'maxLength'],
					});
				}
				if (pattern !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `'pattern' validation rule is only allowed for string type, but field type is '${data.type}'`,
						path: ['validation', 'pattern'],
					});
				}
			}

			// minItems/maxItems only for array
			if ((minItems !== undefined || maxItems !== undefined) && data.type !== 'array') {
				if (minItems !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `'minItems' validation rule is only allowed for array type, but field type is '${data.type}'`,
						path: ['validation', 'minItems'],
					});
				}
				if (maxItems !== undefined) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `'maxItems' validation rule is only allowed for array type, but field type is '${data.type}'`,
						path: ['validation', 'maxItems'],
					});
				}
			}
		}
	}) satisfies z.ZodType<FieldDefinition>;

// Zod Schema for complete Schema Definition
const SchemaDefinitionSchema = z
	.array(FieldSchema)
	.min(1, 'Schema must have at least one field')
	.superRefine((fields, ctx) => {
		// Check for duplicate field names
		const names = fields.map(f => f.name);
		const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
		if (duplicates.length > 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Duplicate field names are not allowed: ${duplicates.join(', ')}`,
				path: [],
			});
		}

		// Ensure exactly one primary key
		const primaryFields = fields.filter(f => f.primary);
		if (primaryFields.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Schema must have exactly one primary key field',
				path: [],
			});
		} else if (primaryFields.length > 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Schema must have exactly one primary key field',
				path: [],
			});
		}

		// Ensure primary key is correct type
		const primaryField = primaryFields[0];
		if (primaryField && !['string', 'number', 'uuid'].includes(primaryField.type)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Primary key field must be type of string, number or uuid',
				path: [],
			});
		}

		// Validate that minLength <= maxLength
		fields.forEach((field, index) => {
			const val = field.validation;
			if (val?.minLength !== undefined && val?.maxLength !== undefined) {
				if (val.minLength > val.maxLength) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'minLength must be less than or equal to maxLength',
						path: [index, 'validation'],
					});
				}
			}
		});

		// Validate that min <= max for numbers
		fields.forEach((field, index) => {
			const val = field.validation;
			if (val?.min !== undefined && val?.max !== undefined) {
				if (val.min > val.max) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'min must be less than or equal to max',
						path: [index, 'validation'],
					});
				}
			}
		});
	}) satisfies z.ZodType<SchemaDefinition>;

// Validate schema definition using Zod
export function validateSchemaDefinition(fields: unknown): SchemaDefinition | { error: string } {
	try {
		return SchemaDefinitionSchema.parse(fields);
	} catch (error) {
		console.log({ error });
		if (error instanceof z.ZodError) {
			return { error: `Invalid: ${error.errors[0].message}` };
		}
		console.log(error);
		return { error: (error as Error).message };
	}
}

// Create dynamic Zod schema from field definitions
function createDynamicZodSchema(
	fields: SchemaDefinition
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
						`${field.name} must be at least ${val.minLength} characters`
					);
				}

				if (val.maxLength !== undefined) {
					stringSchema = stringSchema.max(
						val.maxLength,
						`${field.name} must be at most ${val.maxLength} characters`
					);
				}

				if (val.pattern) {
					try {
						const regex = new RegExp(val.pattern);
						stringSchema = stringSchema.regex(regex, `${field.name} format is invalid`);
					} catch {
						throw new Error(`Invalid regex pattern for field ${field.name}: ${val.pattern}`);
					}
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
					numberSchema = numberSchema.min(val.min, `${field.name} must be at least ${val.min}`);
				}

				if (val.max !== undefined) {
					numberSchema = numberSchema.max(val.max, `${field.name} must be at most ${val.max}`);
				}
			}
			schema = numberSchema;
			break;
		}

		case 'boolean':
			schema = z.boolean();
			break;

		case 'array': {
			let itemSchema: z.ZodTypeAny = z.any();
			if ('items' in field && field.items) {
				// Recursively build the schema for the array items
				itemSchema = createFieldZodSchema({
					...field.items,
					// If you want to support enum validation for arrays of primitives:
					validation: undefined, // Let enum be handled below
				} as FieldDefinition);

				// If enum is present, restrict allowed enum
				if (field.items.enum) {
					itemSchema = itemSchema.refine(val => field.items!.enum!.includes(val), {
						message: `Value must be one of: ${field.items.enum.join(', ')}`,
					});
				}
			}

			let arraySchema: z.ZodArray<z.ZodTypeAny> = z.array(itemSchema);

			// Apply array validations
			if (field.validation) {
				const val = field.validation;

				if (val.minItems !== undefined) {
					arraySchema = arraySchema.min(
						val.minItems,
						`${field.name} must have at least ${val.minItems} items`
					);
				}

				if (val.maxItems !== undefined) {
					arraySchema = arraySchema.max(
						val.maxItems,
						`${field.name} must have at most ${val.maxItems} items`
					);
				}
			}
			schema = arraySchema;
			break;
		}

		case 'object':
			if ('fields' in field && Array.isArray(field.fields)) {
				schema = createDynamicZodSchema(field.fields);
			} else {
				schema = z.object({}).passthrough(); // fallback: allow any object
			}
			break;

		case 'date':
			schema = z.date();
			break;

		case 'email':
			schema = z.string().email();
			break;

		case 'url':
			schema = z.string().url();
			break;

		case 'uuid':
			schema = z.string().uuid();
			break;

		default:
			// This should never happen due to Zod validation, but TypeScript doesn't know that
			throw new Error(`Unsupported field type: ${(field as FieldDefinition).type}`);
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
	schemaFields: SchemaDefinition
): ValidationResult<T> {
	try {
		const zodSchema = createDynamicZodSchema(schemaFields);
		const validatedData = zodSchema.parse(data) as T;

		return {
			isValid: true,
			data: validatedData,
			errors: [],
		};
	} catch (error) {
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
					message: error instanceof Error ? error.message : 'Unknown error occurred',
					code: 'unknown',
				},
			],
		};
	}
}

export const SchemaZod = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(25, 'Name cannot be more than 25 characters')
		.regex(/^[A-Z][A-Z0-9 ]*$/i, 'Name must be a valid e.g Project, Project 1'),
	fakeData: z.boolean(),
}) satisfies z.ZodType<Pick<SchemaBase, 'name' | 'fakeData'>>;
