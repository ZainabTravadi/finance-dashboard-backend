# API Reference

Base URL: http://localhost:5000

Interactive docs: http://localhost:5000/api-docs

## Authentication

Protected endpoints require:

Authorization: Bearer <jwt_token>

Token is returned by login and register responses.

## Error Format

Global error handler returns:

```json
{
  "status": "error",
  "message": "Error details"
}
```

Common status codes:

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

## Auth Endpoints

### POST /auth/register

Create a user account.

Request body:

```json
{
  "name": "Aarav Mehta",
  "email": "aarav@example.com",
  "password": "StrongPass123"
}
```

Response 201:

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt>",
  "user": {
    "_id": "...",
    "name": "Aarav Mehta",
    "email": "aarav@example.com",
    "role": "viewer",
    "isActive": true
  }
}
```

### POST /auth/login

Authenticate user and return JWT.

Request body:

```json
{
  "email": "admin@zorvyn.com",
  "password": "Admin@12345"
}
```

Response 200:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "_id": "...",
    "name": "Aarav Mehta",
    "email": "admin@zorvyn.com",
    "role": "admin",
    "isActive": true
  }
}
```

## User Endpoints

All /users endpoints require admin role.

### GET /users

List users.

Response 200:

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "name": "Aarav Mehta",
      "email": "admin@zorvyn.com",
      "role": "admin",
      "isActive": true
    }
  ]
}
```

### GET /users/:id

Get one user.

### PATCH /users/:id

Update fields: name, email, role, isActive.

Example body:

```json
{
  "role": "analyst",
  "isActive": true
}
```

### DELETE /users/:id

Delete one user.

## Record Endpoints

Access control:

- Read: admin, analyst
- Write: admin

### POST /records

Create financial record.

Request body:

```json
{
  "amount": 4500,
  "type": "income",
  "category": "salary",
  "date": "2026-03-15T10:00:00.000Z",
  "notes": "Monthly salary"
}
```

Response 201:

```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "_id": "...",
    "amount": 4500,
    "type": "income",
    "category": "salary",
    "date": "2026-03-15T10:00:00.000Z",
    "notes": "Monthly salary",
    "createdBy": "..."
  }
}
```

### GET /records

Get records with filtering and pagination.

Query params:

- type: income | expense
- category: case-insensitive partial match
- startDate: ISO date
- endDate: ISO date
- page: default 1
- limit: default 10, max 100

Example:

GET /records?type=expense&category=food&page=2&limit=5

Response 200:

```json
{
  "success": true,
  "total": 24,
  "page": 2,
  "pages": 5,
  "data": [
    {
      "_id": "...",
      "amount": 220,
      "type": "expense",
      "category": "food",
      "date": "2026-02-10T08:30:00.000Z",
      "notes": "Groceries",
      "createdBy": {
        "_id": "...",
        "name": "Aarav Mehta",
        "email": "admin@zorvyn.com"
      }
    }
  ]
}
```

### GET /records/:id

Get one record.

### PUT /records/:id

Update a record.

Example body:

```json
{
  "amount": 1800,
  "notes": "Updated note"
}
```

### DELETE /records/:id

Delete a record.

## Dashboard Endpoints

All /dashboard endpoints require admin or analyst role.

### GET /dashboard/summary

Returns income, expense, and net balance.

Response 200:

```json
{
  "success": true,
  "data": {
    "totalIncome": 32000,
    "totalExpense": 9800,
    "netBalance": 22200
  }
}
```

### GET /dashboard/category

Returns category totals.

Response 200:

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "category": "salary",
      "total": 24000,
      "count": 4
    }
  ]
}
```

### GET /dashboard/trends

Returns monthly income/expense trends.

Response 200:

```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "month": "2026-01",
      "income": 8000,
      "expense": 2100
    }
  ]
}
```

### GET /dashboard/metrics

Returns combined analytics payload (summary, record counts, top categories, average transaction).

## Quick curl Examples

Health:

```bash
curl -s http://localhost:5000/
```

Login:

```bash
curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zorvyn.com","password":"Admin@12345"}'
```

Records (paginated):

```bash
curl -s "http://localhost:5000/records?page=1&limit=10" \
  -H "Authorization: Bearer <jwt_token>"
```

Dashboard trends:

```bash
curl -s http://localhost:5000/dashboard/trends \
  -H "Authorization: Bearer <jwt_token>"
```
