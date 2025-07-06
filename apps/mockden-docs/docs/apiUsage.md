---
sidebar_position: 3
---

# API Usage

## Overview

Mockden automatically generates RESTful APIs based on your custom schema definitions. Once you create a schema, the system provides a complete CRUD API with GET, POST, PUT, and DELETE endpoints that validate data against your schema rules.

## API Configuration

### Custom Headers
Each generated API requires a custom header for authentication and schema identification:

```
x-mockden-header: your-api-key-here
```

### Custom URL Structure
Your API endpoints follow this pattern:

```
Base URL: https://api.mockden.com/mockdata/{project-name}/{schema-name}
```

Where `{project-name}` is replaced with your actual project name and `{schema-name}` is replaced with your actual schema name.

## Example Schema

For demonstration purposes, we'll use this example schema throughout the documentation:

```json
[
    {
      "name": "id",
      "type": "uuid",
      "primary": true,
      "nullable": false
    },
    {
      "name": "name",
      "type": "string",
      "nullable": false,
      "validation": {
        "minLength": 2,
        "maxLength": 50
      }
    },
    {
      "name": "email",
      "type": "email",
      "nullable": false
    },
    {
      "name": "age",
      "type": "number",
      "nullable": true,
      "validation": {
        "min": 0,
        "max": 120
      }
    },
    {
      "name": "isActive",
      "type": "boolean",
      "nullable": false,
      "default": true
    },
    {
      "name": "tags",
      "type": "array",
      "nullable": true,
      "items": {
        "type": "string",
        "enum": ["admin", "user", "guest", "premium"]
      },
      "validation": {
        "minItems": 1,
        "maxItems": 3
      }
    },
    {
      "name": "profile",
      "type": "object",
      "nullable": true,
      "fields": [
        {
          "name": "bio",
          "type": "string",
          "nullable": true,
          "validation": {
            "maxLength": 500
          }
        },
        {
          "name": "website",
          "type": "url",
          "nullable": true
        }
      ]
    },
    {
      "name": "createdAt",
      "type": "date",
      "nullable": false,
      "validation": {
        "min": "2020-01-01"
      }
    }
  ]
}
```

## API Endpoints

### 1. CREATE - POST Request

Create a new record in your schema.

**Endpoint:** `POST /mockdata/{project-name}/{schema-name}`

**Headers:**
```
Content-Type: application/json
x-mockden-header: your-api-key-here
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "isActive": true,
  "tags": ["admin", "premium"],
  "profile": {
    "bio": "Software developer with 10+ years experience",
    "website": "https://johndoe.dev"
  },
  "createdAt": "2024-01-15"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "isActive": true,
    "tags": ["admin", "premium"],
    "profile": {
      "bio": "Software developer with 10+ years experience",
      "website": "https://johndoe.dev"
    },
    "createdAt": "2024-01-15"
  },
  "message": "Record created successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email",
      "code": "invalid_string"
    },
    {
      "field": "age",
      "message": "age must be at most 120",
      "code": "too_big"
    }
  ],
  "message": "Validation failed"
}
```

### 2. READ - GET Requests

#### Get All Records

**Endpoint:** `GET /mockdata/{project-name}/{schema-name}`

**Headers:**
```
x-mockden-header: your-api-key-here
```

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 10, max: 100)
- `offset` (optional): Number of records to skip (default: 0)
- `sort` (optional): Field to sort by (default: primary key)
- `order` (optional): Sort order - 'asc' or 'desc' (default: 'asc')

**Example Request:**
```
GET /mockdata/project-1/users?limit=5&offset=0&sort=name&order=asc
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "age": 28,
      "isActive": true,
      "tags": ["user"],
      "profile": {
        "bio": "Marketing specialist",
        "website": "https://alice.com"
      },
      "createdAt": "2024-01-10"
    },
    {
      "id": "987fcdeb-51d2-43a1-b456-426614174001",
      "name": "Bob Smith",
      "email": "bob@example.com",
      "age": 35,
      "isActive": false,
      "tags": ["admin", "user"],
      "profile": null,
      "createdAt": "2024-01-12"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 5,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Get Single Record

**Endpoint:** `GET /mockdata/{project-name}/{schema-name}/{record-id}`

**Headers:**
```
x-mockden-header: your-api-key-here
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "isActive": true,
    "tags": ["admin", "premium"],
    "profile": {
      "bio": "Software developer with 10+ years experience",
      "website": "https://johndoe.dev"
    },
    "createdAt": "2024-01-15"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Record not found",
  "code": "NOT_FOUND"
}
```
### 3. UPDATE - PUT Request

Update an existing record (full replacement).

**Endpoint:** `PUT /mockdata/{project-name}/{schema-name}/{record-id}`

**Headers:**
```
Content-Type: application/json
x-mockden-header: your-api-key-here
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "age": 31,
  "isActive": false,
  "tags": ["user"],
  "profile": {
    "bio": "Senior software engineer",
    "website": "https://johnsmith.dev"
  },
  "createdAt": "2024-01-15"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "age": 31,
    "isActive": false,
    "tags": ["user"],
    "profile": {
      "bio": "Senior software engineer",
      "website": "https://johnsmith.dev"
    },
    "createdAt": "2024-01-15"
  },
  "message": "Record updated successfully"
}
```

### 4. DELETE - DELETE Request

Delete an existing record.

**Endpoint:** `DELETE /mockdata/{project-name}/{schema-name}/{record-id}`

**Headers:**
```
x-mockden-header: your-api-key-here
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Record deleted successfully",
  "deletedId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Record not found",
  "code": "NOT_FOUND"
}
```

## Error Responses

### Common HTTP Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Record created successfully |
| 400 | Bad Request | Validation errors, malformed JSON |
| 401 | Unauthorized | Invalid or missing API key |
| 404 | Not Found | Record or schema not found |
| 409 | Conflict | Duplicate primary key |
| 422 | Unprocessable Entity | Schema validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific field error message",
      "code": "validation_error_code"
    }
  ]
}
```

## Request/Response Examples by Field Type

### String Fields

**Valid Values:**
```json
{
  "name": "Valid String",
  "description": "Another valid string with special chars: !@#$%"
}
```

**Invalid Values:**
```json
{
  "name": "", // Fails minLength validation
  "description": "A".repeat(1001) // Fails maxLength validation
}
```

### Number Fields

**Valid Values:**
```json
{
  "age": 25,
  "price": 99.99,
  "quantity": 0
}
```

**Invalid Values:**
```json
{
  "age": -5, // Fails min validation
  "price": "not-a-number", // Type error
  "quantity": 1001 // Fails max validation
}
```

### Boolean Fields

**Valid Values:**
```json
{
  "isActive": true,
  "isDeleted": false
}
```

**Invalid Values:**
```json
{
  "isActive": "yes", // Type error
  "isDeleted": 1 // Type error
}
```

### Date Fields

**Valid Values:**
```json
{
  "createdAt": "2024-01-15",
  "updatedAt": "2024-12-31"
}
```

**Invalid Values:**
```json
{
  "createdAt": "invalid-date", // Format error
  "updatedAt": "2019-12-31" // Fails min validation
}
```

### Array Fields

**Valid Values:**
```json
{
  "tags": ["admin", "user"],
  "categories": ["tech", "business", "personal"]
}
```

**Invalid Values:**
```json
{
  "tags": [], // Fails minItems validation
  "categories": ["invalid-enum-value"] // Fails enum validation
}
```

### Object Fields

**Valid Values:**
```json
{
  "profile": {
    "bio": "Valid bio text",
    "website": "https://example.com"
  }
}
```

**Invalid Values:**
```json
{
  "profile": {
    "bio": "A".repeat(501), // Fails maxLength validation
    "website": "invalid-url" // Fails URL validation
  }
}
```
## SDK and Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.mockden.com/mockdata',
  headers: {
    'x-mockden-header': 'your-api-key-here'
    'Content-Type': 'application/json'
  }
});

// Create a record
async function createUser(userData) {
  try {
    const response = await client.post('/project-1/user-mgmt-001', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response.data);
    throw error;
  }
}

// Get all records
async function getUsers(params = {}) {
  try {
    const response = await client.get('/schemas/user-mgmt-001/data', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response.data);
    throw error;
  }
}
```
