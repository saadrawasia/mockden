// Type definitions
type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url' | 'uuid' | 'date';

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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
};

export type ProjectBase = {
  name: string;
  description: string;
};

export type Message = {
  message: string;
};
