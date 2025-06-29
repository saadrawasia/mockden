import { z } from "zod";

import type {
	FieldDefinition,
	SchemaBase,
	SchemaDefinition,
	ValidationError,
	ValidationResult,
	ZodError,
} from "../lib/types";

const fieldTypeEnum = z.enum(
	["string", "number", "boolean", "array", "object", "date", "url", "uuid", "email"],
	{
		errorMap: () => ({
			message:
				"Type must be one of: string, number, boolean, array, object, date, url, uuid or email",
		}),
	}
);

export type FieldType = z.infer<typeof fieldTypeEnum>;

// Zod Schema for Field Definition
const FieldSchema = z.object({
	name: z
		.string()
		.min(1, "Field name is required")
		.regex(/^[a-z]*$/i, "Field name must contain only lowercase letters"),
	type: fieldTypeEnum,
	items: z
		.object({
			type: fieldTypeEnum,
			enum: z.array(z.unknown()).optional(),
		})
		.optional()
		.refine(
			val => {
				if (!val || !val.enum) return true;
				switch (val.type) {
					case "string":
					case "url":
					case "uuid":
					case "email":
						return val.enum.every((v: unknown) => typeof v === "string");
					case "number":
						return val.enum.every((v: unknown) => typeof v === "number");
					case "boolean":
						return val.enum.every((v: unknown) => typeof v === "boolean");
					case "date":
						return val.enum.every((v: unknown) => typeof v === "string" || v instanceof Date);
					case "array":
						return val.enum.every((v: unknown) => Array.isArray(v));
					case "object":
						return val.enum.every(
							(v: unknown) => typeof v === "object" && !Array.isArray(v) && v !== null
						);
					default:
						return true;
				}
			},
			{
				message: "Enum values must match the type of items.type",
			}
		),
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
}) satisfies z.ZodType<FieldDefinition>;

// Zod Schema for complete Schema Definition
const SchemaDefinitionSchema = z
	.array(FieldSchema)
	.min(1, "Schema must have at least one field")
	.refine((fields): fields is FieldDefinition[] => {
		// Check for duplicate field names
		const names = fields.map(f => f.name);
		return new Set(names).size === names.length;
	}, "Duplicate field names are not allowed")
	.refine((fields): fields is FieldDefinition[] => {
		// Ensure exactly one primary key
		const primaryFields = fields.filter(f => f.primary);
		return primaryFields.length === 1;
	}, "Schema must have exactly one primary key field")
	.refine((fields): fields is FieldDefinition[] => {
		// Ensure exactly one primary key
		const primaryField = fields.filter(f => f.primary)[0];
		return ["string", "number", "uuid"].includes(primaryField?.type || "");
	}, "Primary key field must be type of string, number or uuid")
	.refine((fields): fields is FieldDefinition[] => {
		// Validate that minLength <= maxLength
		return fields.every(field => {
			const val = field.validation;
			if (val?.minLength !== undefined && val?.maxLength !== undefined) {
				return val.minLength <= val.maxLength;
			}
			return true;
		});
	}, "minLength must be less than or equal to maxLength")
	.refine((fields): fields is FieldDefinition[] => {
		// Validate that min <= max for numbers
		return fields.every(field => {
			const val = field.validation;
			if (val?.min !== undefined && val?.max !== undefined) {
				return val.min <= val.max;
			}
			return true;
		});
	}, "min must be less than or equal to max") satisfies z.ZodType<SchemaDefinition>;

// Validate schema definition using Zod
export function validateSchemaDefinition(fields: unknown): SchemaDefinition | ZodError {
	try {
		return SchemaDefinitionSchema.parse(fields);
	} catch (error) {
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
		case "string": {
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

		case "number": {
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

		case "boolean":
			schema = z.boolean();
			break;

		case "array": {
			let itemSchema: z.ZodTypeAny = z.any();
			if ("items" in field && field.items) {
				// Recursively build the schema for the array items
				itemSchema = createFieldZodSchema({
					...field.items,
					// If you want to support enum validation for arrays of primitives:
					validation: undefined, // Let enum be handled below
				} as FieldDefinition);

				// If enum is present, restrict allowed enum
				if (field.items.enum) {
					itemSchema = itemSchema.refine(val => field.items!.enum!.includes(val), {
						message: `Value must be one of: ${field.items.enum.join(", ")}`,
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

		case "object":
			if ("fields" in field && Array.isArray(field.fields)) {
				schema = createDynamicZodSchema(field.fields);
			} else {
				schema = z.object({}).passthrough(); // fallback: allow any object
			}
			break;

		case "date":
			schema = z.date();
			break;

		case "email":
			schema = z.string().email();
			break;

		case "url":
			schema = z.string().url();
			break;

		case "uuid":
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
				field: err.path.join("."),
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
					field: "unknown",
					message: error instanceof Error ? error.message : "Unknown error occurred",
					code: "unknown",
				},
			],
		};
	}
}

export const SchemaZod = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(25, "Name cannot be more than 25 characters")
		.regex(/^[A-Z][A-Z0-9 ]*$/i, "Name must be a valid e.g Project, Project 1"),
	fakeData: z.boolean(),
}) satisfies z.ZodType<Pick<SchemaBase, "name" | "fakeData">>;
