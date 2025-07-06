---
sidebar_position: 1
---

# String
Basic text data with optional validation rules.

**Compatible Attributes:**
- `nullable`: Allow null values
- `primary`: Use as primary key
- `default`: Set default value
- `validation.minLength`: Minimum character length
- `validation.maxLength`: Maximum character length
- `validation.pattern`: Regular expression pattern

**Example:**
```json
{
  "name": "username",
  "type": "string",
  "nullable": false,
  "validation": {
    "minLength": 3,
    "maxLength": 20,
    "pattern": "^[a-zA-Z0-9_]+$"
  }
}
```
