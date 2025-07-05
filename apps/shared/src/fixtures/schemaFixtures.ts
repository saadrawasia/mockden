// ✅ VALID SCHEMAS - These should work without errors

import type { FieldDefinition } from '../lib/types';

// 1. Simple valid schema
const validSchema1 = [
	{
		name: 'id',
		type: 'number',
		primary: true,
		nullable: false,
	},
	{
		name: 'email',
		type: 'email',
		primary: false,
		nullable: false,
	},
	{
		name: 'username',
		type: 'string',
		primary: false,
		nullable: false,
		validation: {
			minLength: 3,
			maxLength: 30,
			pattern: '^[a-zA-Z0-9_]+$',
		},
	},
];

// 2. Valid schema with arrays and objects
const validSchema2 = [
	{
		name: 'userId',
		type: 'uuid',
		primary: true,
		nullable: false,
	},
	{
		name: 'tags',
		type: 'array',
		items: {
			type: 'string',
			enum: ['work', 'personal', 'urgent'],
		},
		validation: {
			minItems: 1,
			maxItems: 5,
		},
	},
	{
		name: 'profile',
		type: 'object',
		fields: [
			{ name: 'firstName', type: 'string' },
			{ name: 'lastName', type: 'string' },
		],
	},
];

// 3. Valid schema with date validation
const validSchema3 = [
	{
		name: 'recordId',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'createdAt',
		type: 'date',
		primary: false,
		nullable: false,
		validation: {
			min: '2020-01-01',
			max: '2030-12-31',
		},
	},
	{
		name: 'isActive',
		type: 'boolean',
		nullable: true,
	},
];

// ❌ INVALID SCHEMAS - These should produce errors

// 1. ERROR: No primary key
const errorSchema1 = [
	{
		name: 'email',
		type: 'email',
		primary: false,
		nullable: false,
	},
	{
		name: 'username',
		type: 'string',
		primary: false,
		nullable: false,
	},
];

// 2. ERROR: Multiple primary keys
const errorSchema2 = [
	{
		name: 'id',
		type: 'number',
		primary: true,
		nullable: false,
	},
	{
		name: 'userId',
		type: 'uuid',
		primary: true,
		nullable: false,
	},
	{
		name: 'email',
		type: 'email',
		primary: false,
		nullable: false,
	},
];

// 3. ERROR: Duplicate field names
const errorSchema3 = [
	{
		name: 'id',
		type: 'number',
		primary: true,
		nullable: false,
	},
	{
		name: 'email',
		type: 'email',
		primary: false,
		nullable: false,
	},
	{
		name: 'email', // Duplicate name
		type: 'string',
		primary: false,
		nullable: false,
	},
];

// 4. ERROR: Invalid primary key type (boolean cannot be primary)
const errorSchema4 = [
	{
		name: 'isActive',
		type: 'boolean',
		primary: true, // Error: boolean can't be primary
		nullable: false,
	},
	{
		name: 'email',
		type: 'email',
		primary: false,
		nullable: false,
	},
];

// 5. ERROR: String validation on non-string field
const errorSchema5 = [
	{
		name: 'id',
		type: 'number',
		primary: true,
		nullable: false,
	},
	{
		name: 'age',
		type: 'number',
		primary: false,
		nullable: false,
		validation: {
			minLength: 1, // Error: minLength only for strings
			maxLength: 10, // Error: maxLength only for strings
		},
	},
];

// 6. ERROR: Array validation on non-array field
const errorSchema6 = [
	{
		name: 'id',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'email',
		type: 'email',
		primary: false,
		nullable: false,
		validation: {
			minItems: 1, // Error: minItems only for arrays
			maxItems: 5, // Error: maxItems only for arrays
		},
	},
];

// 7. ERROR: Min/Max validation on invalid types
const errorSchema7 = [
	{
		name: 'id',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'isActive',
		type: 'boolean',
		primary: false,
		nullable: false,
		validation: {
			min: 0, // Error: min/max only for number/date
			max: 1,
		},
	},
];

// 8. ERROR: minLength > maxLength
const errorSchema8 = [
	{
		name: 'id',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'username',
		type: 'string',
		primary: false,
		nullable: false,
		validation: {
			minLength: 20, // Error: minLength > maxLength
			maxLength: 10,
		},
	},
];

// 9. ERROR: min > max for numbers
const errorSchema9 = [
	{
		name: 'id',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'age',
		type: 'number',
		primary: false,
		nullable: false,
		validation: {
			min: 100, // Error: min > max
			max: 50,
		},
	},
];

// 10. ERROR: Invalid date format
const errorSchema10 = [
	{
		name: 'id',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'birthdate',
		type: 'date',
		primary: false,
		nullable: false,
		validation: {
			min: 'invalid-date', // Error: invalid date format
			max: '2030-12-31',
		},
	},
];

// 11. ERROR: Enum values don't match type
const errorSchema11 = [
	{
		name: 'id',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'roles',
		type: 'array',
		items: {
			type: 'string',
			enum: [1, 2, 3], // Error: enum values are numbers but type is string
		},
	},
];

// 12. ERROR: Invalid field name (contains special characters)
const errorSchema12 = [
	{
		name: 'user-id', // Error: field name contains hyphen
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'email',
		type: 'email',
		primary: false,
		nullable: false,
	},
];

// 13. ERROR: Empty schema
const errorSchema13: FieldDefinition[] = []; // Error: Schema must have at least one field

// 14. ERROR: minItems > maxItems
const errorSchema14 = [
	{
		name: 'id',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'tags',
		type: 'array',
		items: {
			type: 'string',
		},
		validation: {
			minItems: 10, // Error: minItems > maxItems
			maxItems: 5,
		},
	},
];

// 15. ERROR: Invalid regex pattern
const errorSchema15 = [
	{
		name: 'id',
		type: 'string',
		primary: true,
		nullable: false,
	},
	{
		name: 'code',
		type: 'string',
		primary: false,
		nullable: false,
		validation: {
			pattern: '[invalid-regex', // Error: invalid regex pattern (missing closing bracket)
		},
	},
];

export {
	// Invalid schemas
	errorSchema1,
	errorSchema10,
	errorSchema11,
	errorSchema12,
	errorSchema13,
	errorSchema14,
	errorSchema15,
	errorSchema2,
	errorSchema3,
	errorSchema4,
	errorSchema5,
	errorSchema6,
	errorSchema7,
	errorSchema8,
	errorSchema9,
	// Valid schemas
	validSchema1,
	validSchema2,
	validSchema3,
};
