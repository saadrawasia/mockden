import type { Request as ExpressRequest } from "express";

import type { FieldType } from "../validators/schemaValidator";

type ValidationRules = {
	// String validations
	minLength?: number;
	maxLength?: number;
	pattern?: string; // regex pattern

	// Number validations
	min?: number;
	max?: number;

	// Array validations
	minItems?: number;
	maxItems?: number;
};

export type FieldDefinition = {
	name: string;
	type: FieldType;
	items?: { type: FieldType; enum?: unknown[] };
	fields?: FieldDefinition[];
	primary?: boolean;
	nullable?: boolean;
	validation?: ValidationRules;
	default?: unknown;
};

export type SchemaDefinition = FieldDefinition[];

export type ValidationError = {
	field: string;
	message: string;
	code: string;
};

export type ValidationResult<T = unknown> = {
	isValid: boolean;
	data: T | null;
	errors: ValidationError[];
};

export type ZodError = {
	error: string;
};

export type Schema = {
	id: number;
	name: string;
	fields: string;
	fakeData: boolean;
	slug: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	projectId: number;
};

export type SchemaBase = {
	name: string;
	fields: string;
	fakeData: boolean;
};

export type MockData = {
	id: number;
	schema_id: number;
	data: string;
	createdAt: string;
	updatedAt: string;
};

export type Project = {
	id: number;
	name: string;
	description: string;
	slug: string;
	apiKey: string;
	createdAt: Date;
	updatedAt: Date;
};

export type ProjectBase = {
	name: string;
	description: string;
};

export type Message = {
	message: string;
};

export type User = {
	id: number;
	firstName: string;
	lastName: string;
	clerkUserId: string;
	email: string;
	planTier: "free" | "pro";
	createdAt: Date;
	updatedAt: Date;
};

export type RequestWithProject = ExpressRequest & {
	project?: Project;
	user?: User;
	schema?: Schema;
};
