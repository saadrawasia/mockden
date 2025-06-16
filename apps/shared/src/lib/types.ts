// Type definitions
type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

type ValidationFormat = 'email' | 'url' | 'uuid';

type ValidationRules = {
  // String validations
  minLength?: number;
  maxLength?: number;
  pattern?: string; // regex pattern
  format?: ValidationFormat;

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
  id: string;
  name: string;
  fields: string;
  fakeData: boolean;
  slug: string;
  status: 'active' | 'inactive';
  created_at: string;
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
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  slug: string;
};

export type ProjectBase = {
  name: string;
  description: string;
};

export type Message = {
  message: string;
};
