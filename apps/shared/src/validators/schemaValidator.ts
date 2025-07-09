import { z } from 'zod';

import { isValidDate } from '../helpers/isValidDate';
import type {
	FieldDefinition,
	SchemaBase,
	SchemaDefinition,
	ValidationError,
	ValidationResult,
} from '../lib/types';

// Define supported field types with better type safety
const FIELD_TYPES = [
	'string',
	'number',
	'boolean',
	'array',
	'object',
	'date',
	'url',
	'uuid',
	'email',
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

// More efficient field type validation
const fieldTypeEnum = z.enum(FIELD_TYPES, {
	errorMap: () => ({
		message: `Type must be one of: ${FIELD_TYPES.join(', ')}`,
	}),
});

// Type-safe validation rule constraints
const PRIMARY_KEY_TYPES = ['string', 'number', 'uuid'] as const;
const MIN_MAX_TYPES = ['number', 'date'] as const;

type PrimaryKeyType = (typeof PRIMARY_KEY_TYPES)[number];
type MinMaxType = (typeof MIN_MAX_TYPES)[number];

// Helper function to validate enum values match their declared type
function validateEnumValues(enumValues: unknown[], fieldType: FieldType): boolean {
	const typeCheckers: Record<FieldType, (value: unknown) => boolean> = {
		string: (v): v is string => typeof v === 'string',
		url: (v): v is string => typeof v === 'string',
		uuid: (v): v is string => typeof v === 'string',
		email: (v): v is string => typeof v === 'string',
		number: (v): v is number => typeof v === 'number',
		boolean: (v): v is boolean => typeof v === 'boolean',
		date: (v): v is string | Date => typeof v === 'string' || v instanceof Date,
		array: (v): v is unknown[] => Array.isArray(v),
		object: (v): v is object => typeof v === 'object' && !Array.isArray(v) && v !== null,
	};

	return enumValues.every(typeCheckers[fieldType]);
}

// Helper function to validate min/max values
function validateMinMaxValue(value: unknown, fieldType: MinMaxType): boolean {
	if (fieldType === 'number') {
		return typeof value === 'number';
	}
	if (fieldType === 'date') {
		return (typeof value === 'string' && isValidDate(value)) || typeof value === 'number';
	}
	return false;
}

// Enhanced field schema with better type safety
const FieldSchema = z
	.object({
		name: z
			.string({ errorMap: () => ({ message: 'Field name is required' }) })
			.min(1, 'Field name is required')
			.regex(/^[a-z]+$/i, 'Field name must contain only letters'),
		type: fieldTypeEnum,
		items: z
			.object({
				type: fieldTypeEnum,
				enum: z.array(z.unknown()).optional(),
			})
			.optional()
			.superRefine((val, ctx) => {
				if (!val?.enum) return;

				if (!validateEnumValues(val.enum, val.type)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Enum values must match the type '${val.type}'`,
						path: ['enum'],
					});
				}
			}),
		fields: z.array(z.lazy((): z.ZodType<FieldDefinition> => FieldSchema)).optional(),
		primary: z.boolean().default(false),
		nullable: z.boolean().default(false),
		validation: z
			.object({
				minLength: z.number().int().nonnegative().optional(),
				maxLength: z.number().int().positive().optional(),
				pattern: z.string().optional(),
				min: z.union([z.number(), z.string()]).optional(),
				max: z.union([z.number(), z.string()]).optional(),
				minItems: z.number().int().nonnegative().optional(),
				maxItems: z.number().int().positive().optional(),
			})
			.optional(),
		default: z.unknown().optional(),
	})
	.superRefine((data, ctx) => {
		// Validate primary key constraints
		if (data.primary && !PRIMARY_KEY_TYPES.includes(data.type as PrimaryKeyType)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Only ${PRIMARY_KEY_TYPES.join(', ')} types can be primary keys`,
				path: ['primary'],
			});
		}

		// Validate field-specific validation rules
		if (data.validation) {
			const { min, max, minLength, maxLength, pattern, minItems, maxItems } = data.validation;

			// Min/max validation
			if (min !== undefined || max !== undefined) {
				if (!MIN_MAX_TYPES.includes(data.type as MinMaxType)) {
					const invalidFields = [
						...(min !== undefined ? ['min'] : []),
						...(max !== undefined ? ['max'] : []),
					];

					invalidFields.forEach(field => {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `'${field}' validation is only allowed for ${MIN_MAX_TYPES.join(', ')} types`,
							path: [field],
						});
					});
				} else {
					// Validate min/max values are appropriate for the field type
					if (min !== undefined && !validateMinMaxValue(min, data.type as MinMaxType)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Invalid min value for ${data.type} type`,
							path: ['validation', 'min'],
						});
					}
					if (max !== undefined && !validateMinMaxValue(max, data.type as MinMaxType)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Invalid max value for ${data.type} type`,
							path: ['validation', 'max'],
						});
					}
				}
			}

			// String validation rules
			if (minLength !== undefined || maxLength !== undefined || pattern !== undefined) {
				if (data.type !== 'string') {
					const invalidFields = [
						...(minLength !== undefined ? ['minLength'] : []),
						...(maxLength !== undefined ? ['maxLength'] : []),
						...(pattern !== undefined ? ['pattern'] : []),
					];

					invalidFields.forEach(field => {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `'${field}' validation is only allowed for string type`,
							path: [field],
						});
					});
				}
			}

			// Array validation rules
			if (minItems !== undefined || maxItems !== undefined) {
				if (data.type !== 'array') {
					const invalidFields = [
						...(minItems !== undefined ? ['minItems'] : []),
						...(maxItems !== undefined ? ['maxItems'] : []),
					];

					invalidFields.forEach(field => {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `'${field}' validation is only allowed for array type`,
							path: [field],
						});
					});
				}
			}
		}
	}) satisfies z.ZodType<FieldDefinition>;

// Enhanced schema definition validation
export const SchemaDefinitionSchema = z
	.array(FieldSchema)
	.min(1, 'Schema must have at least one field')
	.superRefine((fields, ctx) => {
		// Check for duplicate field names
		const nameMap = new Map<string, number>();
		const duplicates = new Set<string>();

		fields.forEach((field, index) => {
			const existingIndex = nameMap.get(field.name);
			if (existingIndex !== undefined) {
				duplicates.add(field.name);
			} else {
				nameMap.set(field.name, index);
			}
		});

		if (duplicates.size > 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.invalid_arguments,
				message: `Duplicate field names: ${Array.from(duplicates).join(', ')}`,
				path: [],
				argumentsError: new z.ZodError([]),
			});
		}

		// Validate primary key constraints
		const primaryFields = fields.filter(f => f.primary);
		if (primaryFields.length !== 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.invalid_arguments,
				message: 'Schema must have exactly one primary key field',
				path: [],
				argumentsError: new z.ZodError([]),
			});
		}

		// Validate field-specific constraints
		fields.forEach((field, index) => {
			const validation = field.validation;
			if (!validation) return;

			// String length constraints
			if (validation.minLength !== undefined && validation.maxLength !== undefined) {
				if (validation.minLength > validation.maxLength) {
					ctx.addIssue({
						code: z.ZodIssueCode.too_big,
						message: 'minLength must be ≤ maxLength',
						path: [index, 'validation'],
						type: 'string',
						maximum: validation.maxLength,
						inclusive: true,
					});
				}
			}
			if (validation.pattern) {
				try {
					new RegExp(validation.pattern);
				} catch {
					ctx.addIssue({
						code: z.ZodIssueCode.invalid_arguments,
						message: `${field.name} pattern is invalid`,
						path: [index, 'pattern'],
						argumentsError: new z.ZodError([]),
					});
				}
			}

			// Number/date min/max constraints
			if (validation.min !== undefined && validation.max !== undefined) {
				if (
					field.type === 'number' &&
					typeof validation.min === 'number' &&
					typeof validation.max === 'number'
				) {
					if (validation.min > validation.max) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_big,
							type: 'number',
							maximum: validation.max,
							inclusive: true,
							message: 'min must be ≤ max',
							path: [index, 'validation'],
						});
					}
				} else if (
					field.type === 'date' &&
					typeof validation.min === 'string' &&
					typeof validation.max === 'string'
				) {
					if (!isValidDate(validation.min)) {
						ctx.addIssue({
							code: z.ZodIssueCode.invalid_date,
							message: 'min must be a valid date string',
							path: [index, 'validation', 'min'],
						});
					} else if (!isValidDate(validation.max)) {
						ctx.addIssue({
							code: z.ZodIssueCode.invalid_date,
							message: 'max must be a valid date string',
							path: [index, 'validation', 'max'],
						});
					} else if (new Date(validation.min) > new Date(validation.max)) {
						ctx.addIssue({
							code: z.ZodIssueCode.invalid_arguments,
							message: 'min date must be ≤ max date',
							path: [index, 'validation'],
							argumentsError: new z.ZodError([]),
						});
					}
				}
			}

			// Array items constraints
			if (validation.minItems !== undefined && validation.maxItems !== undefined) {
				if (validation.minItems > validation.maxItems) {
					ctx.addIssue({
						code: z.ZodIssueCode.too_big,
						message: 'minItems must be ≤ maxItems',
						path: [index, 'validation'],
						type: 'number',
						maximum: validation.maxItems,
						inclusive: true,
					});
				}
			}
		});
	}) satisfies z.ZodType<SchemaDefinition>;

// Enhanced schema validation with better error handling
export function validateSchemaDefinition(fields: unknown): SchemaDefinition | { error: string } {
	const result = SchemaDefinitionSchema.safeParse(fields);

	if (!result.success) {
		// Return the first error for simplicity, but could return all errors
		const firstError = result.error.errors[0];
		return { error: `Invalid schema: ${firstError.message}` };
	}

	return result.data;
}

// Type-safe field schema creation with better error handling
function createFieldZodSchema(field: FieldDefinition): z.ZodTypeAny {
	let schema: z.ZodTypeAny;

	try {
		switch (field.type) {
			case 'string': {
				const { minLength, maxLength, pattern } = field.validation ?? {};
				schema = z.string().superRefine((val, ctx) => {
					if (minLength !== undefined && val.length < minLength) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_small,
							message: `${field.name} must be at least ${minLength} characters`,
							minimum: minLength,
							inclusive: true,
							type: 'string',
							path: [],
							fatal: true,
						});
						return;
					}
					if (maxLength !== undefined && val.length > maxLength) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_big,
							message: `${field.name} must be at most ${maxLength} characters`,
							maximum: maxLength,
							inclusive: true,
							type: 'string',
							path: [],
							fatal: true,
						});
						return;
					}
					if (pattern && !new RegExp(pattern).test(val)) {
						ctx.addIssue({
							code: z.ZodIssueCode.invalid_string,
							message: `${field.name} pattern is invalid`,
							validation: 'regex',
							path: [],
							fatal: true,
						});
						return;
					}
				});
				break;
			}

			case 'number': {
				const { min, max } = field.validation ?? {};
				schema = z.number().superRefine((val, ctx) => {
					if (min !== undefined && typeof min === 'number' && val < min) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_small,
							message: `${field.name} must be at least ${min}`,
							minimum: min,
							inclusive: true,
							type: 'number',
							path: [],
							fatal: true,
						});
						return;
					}
					if (max !== undefined && typeof max === 'number' && val > max) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_big,
							message: `${field.name} must be at most ${max}`,
							maximum: max,
							inclusive: true,
							type: 'number',
							path: [],
							fatal: true,
						});
						return;
					}
				});
				break;
			}

			case 'boolean':
				schema = z.boolean();
				break;

			case 'array': {
				const { minItems, maxItems } = field.validation ?? {};
				let itemSchema: z.ZodTypeAny = z.unknown();

				if (field.items) {
					itemSchema = createFieldZodSchema({
						name: `${field.name}_item`,
						type: field.items.type,
						primary: false,
						nullable: false,
					} as FieldDefinition);

					if (field.items.enum) {
						itemSchema = itemSchema.refine(val => field.items!.enum!.includes(val), {
							message: `Value must be one of: ${field.items.enum.join(', ')}`,
						});
					}
				}

				schema = z.array(itemSchema).superRefine((arr, ctx) => {
					if (minItems !== undefined && arr.length < minItems) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_small,
							message: `${field.name} must have at least ${minItems} items`,
							minimum: minItems,
							inclusive: true,
							type: 'array',
							path: [],
							fatal: true,
						});
						return;
					}
					if (maxItems !== undefined && arr.length > maxItems) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_big,
							message: `${field.name} must have at most ${maxItems} items`,
							maximum: maxItems,
							inclusive: true,
							type: 'array',
							path: [],
							fatal: true,
						});
						return;
					}
				});
				break;
			}

			case 'object':
				schema =
					field.fields && field.fields.length > 0
						? createDynamicZodSchema(field.fields)
						: z.record(z.unknown()); // Use record for generic object validation
				break;

			case 'date': {
				const { min, max } = field.validation ?? {};

				const dateSchema = z.string().superRefine((val, ctx) => {
					// Check valid date string
					if (!isValidDate(val)) {
						ctx.addIssue({
							code: z.ZodIssueCode.invalid_date,
							message: `${field.name} must be a valid date string`,
							path: [],
							fatal: true, // abort further checks if invalid date
						});
						return;
					}

					// Check min
					if (min !== undefined && typeof min === 'string' && new Date(val) < new Date(min)) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_small,
							message: `${field.name} must be on or after ${min}`,
							path: [],
							fatal: true, // abort further checks if min fails
							minimum: 0,
							inclusive: true,
							type: 'string',
						});
						return;
					}

					// Check max
					if (max !== undefined && typeof max === 'string' && new Date(val) > new Date(max)) {
						ctx.addIssue({
							code: z.ZodIssueCode.too_big,
							message: `${field.name} must be on or before ${max}`,
							path: [],
							fatal: true,
							maximum: 0,
							inclusive: true,
							type: 'string',
						});
						return;
					}
				});

				schema = dateSchema.transform(val => new Date(val).toISOString().slice(0, 10));
				break;
			}

			case 'email':
				schema = z.string().superRefine((val, ctx) => {
					if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
						ctx.addIssue({
							code: z.ZodIssueCode.invalid_string,
							message: `${field.name} must be a valid email`,
							validation: 'email',
							path: [],
							fatal: true,
						});
					}
				});
				break;

			case 'url':
				schema = z.string().superRefine((val, ctx) => {
					try {
						new URL(val);
					} catch {
						ctx.addIssue({
							code: z.ZodIssueCode.invalid_string,
							message: `${field.name} must be a valid URL`,
							validation: 'url',
							path: [],
							fatal: true,
						});
					}
				});
				break;

			case 'uuid':
				schema = z.string().superRefine((val, ctx) => {
					const uuidRegex =
						/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
					if (!uuidRegex.test(val)) {
						ctx.addIssue({
							code: z.ZodIssueCode.invalid_string,
							message: `${field.name} must be a valid UUID`,
							validation: 'uuid',
							path: [],
							fatal: true,
						});
					}
				});
				break;

			default:
				// TypeScript exhaustiveness check
				throw new Error(`Unsupported field type: ${field.type}`);
		}

		// Apply nullable and default value transformations
		if (field.nullable) {
			schema = schema.nullable();
		}

		if (field.default !== undefined) {
			schema = schema.default(field.default);
		}

		// Make non-primary nullable fields optional
		if (!field.primary && field.nullable) {
			schema = schema.optional();
		}

		return schema;
	} catch (error) {
		throw new Error(
			`Failed to create schema for field '${field.name}': ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

// Optimized dynamic schema creation with strict validation (no extra fields allowed)
function createDynamicZodSchema(
	fields: SchemaDefinition
): z.ZodObject<Record<string, z.ZodTypeAny>> {
	const schemaObject: Record<string, z.ZodTypeAny> = {};

	for (const field of fields) {
		schemaObject[field.name] = createFieldZodSchema(field);
	}

	// Use .strict() to prevent extra fields - this will throw an error if any unexpected fields are present
	return z.object(schemaObject).strict();
}

// Enhanced data validation with better error mapping
export function validateData<T = Record<string, unknown>>(
	data: unknown,
	schemaFields: SchemaDefinition
): ValidationResult<T> {
	try {
		const zodSchema = createDynamicZodSchema(schemaFields);
		const result = zodSchema.safeParse(data);

		if (!result.success) {
			const errors: ValidationError[] = result.error.errors.map(err => ({
				field: err.path.join('.') || 'root',
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
			isValid: true,
			data: result.data as T,
			errors: [],
		};
	} catch (error) {
		return {
			isValid: false,
			data: null,
			errors: [
				{
					field: 'schema',
					message: error instanceof Error ? error.message : 'Unknown schema error',
					code: 'schema_error',
				},
			],
		};
	}
}

// Enhanced schema base validation
export const SchemaZod = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(25, 'Name cannot exceed 25 characters')
		.regex(
			/^[A-Z][A-Z0-9 ]*$/i,
			'Name must start with a letter and contain only letters, numbers, and spaces'
		),
	fakeData: z.boolean(),
}) satisfies z.ZodType<Pick<SchemaBase, 'name' | 'fakeData'>>;
