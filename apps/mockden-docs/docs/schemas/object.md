---
sidebar_position: 9
---

# Object
Complex nested structures.

**Compatible Attributes:**
- `nullable`: Allow null values
- `default`: Set default value
- `fields`: Array of nested field definitions

**Example:**
```json
{
  "name": "address",
  "type": "object",
  "nullable": false,
  "fields": [
    {
      "name": "street",
      "type": "string",
      "nullable": false
    },
    {
      "name": "city",
      "type": "string",
      "nullable": false
    },
    {
      "name": "zipCode",
      "type": "string",
      "nullable": false,
      "validation": {
        "pattern": "^[0-9]{5}(-[0-9]{4})?$"
      }
    }
  ]
}
```
