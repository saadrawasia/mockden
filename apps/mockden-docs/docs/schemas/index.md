---
sidebar_position: 1
---

# Overview
List of all the attributes you need to build your schema.

## Field Attributes Reference

### Core Attributes

| Attribute | Type | Description | Compatible Types |
|-----------|------|-------------|------------------|
| `name` | string | Field identifier (letters only) | All |
| `type` | string | Field data type | All |
| `nullable` | boolean | Allow null values (default: false) | All |
| `primary` | boolean | Primary key field (default: false) | string, number, uuid |
| `default` | any | Default value | All |

### Validation Attributes

| Attribute | Type | Description | Compatible Types |
|-----------|------|-------------|------------------|
| `validation.minLength` | number | Minimum string length | string |
| `validation.maxLength` | number | Maximum string length | string |
| `validation.pattern` | string | Regular expression pattern | string |
| `validation.min` | number/string | Minimum value or date | number, date |
| `validation.max` | number/string | Maximum value or date | number, date |
| `validation.minItems` | number | Minimum array length | array |
| `validation.maxItems` | number | Maximum array length | array |

### Array-Specific Attributes

| Attribute | Type | Description | Compatible Types |
|-----------|------|-------------|---|
| `items.type` | string | Type of array elements | array |
| `items.enum` | array | Allowed values for array elements | array |

### Object-Specific Attributes

| Attribute | Type | Description | Compatible Types |
|-----------|------|-------------|---|
| `fields` | array | Nested field definitions | object |

## Schema Rules and Constraints

### Primary Key Rules
- **Exactly one primary key required**: Every schema must have exactly one field marked as primary
- **Supported types**: Only `string`, `number`, and `uuid` types can be primary keys
- **Cannot be nullable**: Primary key fields cannot have `nullable: true`

### Field Name Rules
- **Letters only**: Field names must contain only letters (a-z, A-Z)
- **Required**: Field names cannot be empty
- **Unique**: No duplicate field names within a schema

### Validation Rules
- **String constraints**: `minLength` ≤ `maxLength`
- **Number constraints**: `min` ≤ `max`
- **Date constraints**: `min` date ≤ `max` date
- **Array constraints**: `minItems` ≤ `maxItems`
- **Pattern validation**: Regular expressions must be valid

### Schema Metadata
- **Schema name**: 1-25 characters, must start with a letter, letters/numbers/spaces only
- **Fake data generation**: Boolean flag for generating test data

## Error Handling

The system provides detailed error information including:

- **Field-specific errors**: Identifies which field caused the validation failure
- **Error messages**: Human-readable descriptions of validation failures
- **Error codes**: Programmatic error identification
- **Path information**: For nested objects, shows the exact path to the error

### Common Error Types

- **Required field missing**: Field marked as required but not provided
- **Type mismatch**: Data doesn't match the expected type
- **Validation constraint violation**: Data violates min/max, length, or pattern constraints
- **Primary key violation**: Multiple or missing primary key fields
- **Duplicate field names**: Schema contains duplicate field names
- **Invalid enum values**: Array enum values don't match the specified type

## Best Practices

1. **Use descriptive field names**: Choose clear, meaningful names for your fields
2. **Set appropriate constraints**: Use validation rules to ensure data quality
3. **Handle nullable fields carefully**: Consider whether fields should allow null values
4. **Use proper types**: Choose the most specific type (e.g., `email` instead of `string` for email fields)
5. **Test your schemas**: Validate your schema definitions before using them in production
6. **Handle errors gracefully**: Always check validation results and handle errors appropriately

