import {
	errorSchema1,
	errorSchema2,
	errorSchema3,
	errorSchema4,
	errorSchema5,
	errorSchema6,
	errorSchema7,
	errorSchema8,
	errorSchema9,
	errorSchema10,
	errorSchema11,
	errorSchema12,
	errorSchema13,
	errorSchema14,
	errorSchema15,
	validSchema1,
	validSchema2,
	validSchema3,
} from '../fixtures/schemaFixtures';
import { validateSchemaDefinition } from '../validators/schemaValidator';

describe('Schema Validator Test', () => {
	// Valid Schemas
	it('should be a valid schema', () => {
		const result = validateSchemaDefinition(validSchema1);
		expect('error' in result).not.toBeTruthy();
	});
	it('should be a valid schema 2', () => {
		const result = validateSchemaDefinition(validSchema2);
		expect('error' in result).not.toBeTruthy();
	});
	it('should be a valid schema 3', () => {
		const result = validateSchemaDefinition(validSchema3);
		expect('error' in result).not.toBeTruthy();
	});

	// Error Schemas

	it('should not be a valid schema', () => {
		const result = validateSchemaDefinition(errorSchema1);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 2', () => {
		const result = validateSchemaDefinition(errorSchema2);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 3', () => {
		const result = validateSchemaDefinition(errorSchema3);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 4', () => {
		const result = validateSchemaDefinition(errorSchema4);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 5', () => {
		const result = validateSchemaDefinition(errorSchema5);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 6', () => {
		const result = validateSchemaDefinition(errorSchema6);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 7', () => {
		const result = validateSchemaDefinition(errorSchema7);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 8', () => {
		const result = validateSchemaDefinition(errorSchema8);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 9', () => {
		const result = validateSchemaDefinition(errorSchema9);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 10', () => {
		const result = validateSchemaDefinition(errorSchema10);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 11', () => {
		const result = validateSchemaDefinition(errorSchema11);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 12', () => {
		const result = validateSchemaDefinition(errorSchema12);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 13', () => {
		const result = validateSchemaDefinition(errorSchema13);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 14', () => {
		const result = validateSchemaDefinition(errorSchema14);
		expect('error' in result).toBeTruthy();
	});
	it('should not be a valid schema 15', () => {
		const result = validateSchemaDefinition(errorSchema15);
		expect('error' in result).toBeTruthy();
	});
});
