---
sidebar_position: 7
---

# Date Type
Date validation with range constraints.

**Compatible Attributes:**
- `nullable`: Allow null values
- `default`: Set default value
- `validation.min`: Minimum date (string or timestamp)
- `validation.max`: Maximum date (string or timestamp)

**Example:**
```json
{
  "name": "birthDate",
  "type": "date",
  "nullable": false,
  "validation": {
    "min": "1900-01-01",
    "max": "2010-12-31"
  }
}
```