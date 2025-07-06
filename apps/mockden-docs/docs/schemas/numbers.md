---
sidebar_position: 2
---

# Number
Numeric data with range validation.

**Compatible Attributes:**
- `nullable`: Allow null values
- `primary`: Use as primary key
- `default`: Set default value
- `validation.min`: Minimum value
- `validation.max`: Maximum value

**Example:**
```json
{
  "name": "age",
  "type": "number",
  "nullable": false,
  "validation": {
    "min": 0,
    "max": 150
  }
}
```