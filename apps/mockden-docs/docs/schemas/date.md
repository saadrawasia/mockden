---
sidebar_position: 7
---

# Date
Date validation with range constraints.

**Compatible Attributes:**
- `nullable`: Allow null values
- `default`: Set default value
- `validation.min`: Minimum date (string or timestamp)
- `validation.max`: Maximum date (string or timestamp)

**Format:**
`YYYY-MM-DD`

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

# DateTime
Datetime validation with range constraints.

**Compatible Attributes:**
- `nullable`: Allow null values
- `default`: Set default value
- `validation.min`: Minimum date (string or timestamp)
- `validation.max`: Maximum date (string or timestamp)

**Format:**
`YYYY-MM-DDTHH:mm:ss`

**Example:**
```json
{
  "name": "createdAt",
  "type": "datetime",
  "nullable": false,
}
```