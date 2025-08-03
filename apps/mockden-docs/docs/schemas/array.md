---
sidebar_position: 8
---

# Array
Collections of items with type validation.

**Compatible Attributes:**
- `nullable`: Allow null values
- `default`: Set default value
- `items`: Define the type of array elements
- `items.type`: Type of each array item
- `items.enum`: Allowed values for array items
- `validation.minItems`: Minimum number of items
- `validation.maxItems`: Maximum number of items

**Example:**
```json
{
  "name": "tags",
  "type": "array",
  "nullable": false,
  "items": {
    "type": "string",
    "enum": ["technology", "business", "personal", "urgent"]
  },
  "validation": {
    "minItems": 1,
    "maxItems": 5
  }
}
```
