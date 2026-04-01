# Architecture

## Overview

The backend follows a layered Express + Mongoose structure focused on clear separation of concerns and role-based security.

Core request path:

route -> middleware -> controller -> model -> response

The repository currently has no dedicated service layer implementation, but the code is organized to support route -> controller -> service -> model as the system grows.

## Folder Structure and Responsibilities

```text
src/
  config/
    db.js              # MongoDB connection
    swagger.js         # OpenAPI spec generation
  controllers/         # HTTP handlers and endpoint orchestration
  middleware/          # auth, role authorization, global error handling
  models/              # Mongoose schemas and indexes
  routes/              # Route registration and access control
  utils/
    validationSchemas.js # Joi validation schemas
server.js              # App bootstrap and middleware composition
seed.js                # Sample data seeding
```

## Runtime Flow

1. Request enters Express in [server.js](server.js).
2. Route module resolves endpoint and applies middleware.
3. Authentication middleware validates JWT and attaches user context.
4. Authorization middleware validates role against endpoint policy.
5. Controller executes validation and domain logic.
6. Mongoose model performs database operations.
7. Errors propagate to global error middleware for standardized responses.

## Middleware Model

- authMiddleware: verifies bearer token, loads active user.
- authorize: enforces role access per route (admin, analyst, viewer).
- errorHandler: maps Joi, JWT, Mongoose, and unknown errors to a normalized response.

Error payload shape:

```json
{
  "status": "error",
  "message": "..."
}
```

## Data Model Design

### User

- name
- email (unique, normalized lowercase)
- password (hashed via pre-save hook)
- role (viewer | analyst | admin)
- isActive
- timestamps

### Record

- amount
- type (income | expense)
- category
- date
- notes
- createdBy (ObjectId -> User)
- timestamps

Indexes on Record optimize filtering and trend queries:

- createdBy + date
- type + date
- category
- date

## Analytics and Aggregation

Dashboard endpoints use MongoDB aggregation pipelines:

- summary: group by type and sum amount
- category: group by category and sum amount
- trends: group by month/year with conditional income/expense aggregation
- metrics: facet-based multi-metric aggregation in a single round trip

This keeps heavy calculations in MongoDB and minimizes application-layer data processing.

## Key Technical Decisions

- JWT-based stateless authentication for API-first integration.
- Role-based route protection implemented at middleware level.
- Joi input validation to keep controller logic predictable.
- Centralized error translation for consistent client-side handling.
- Swagger endpoint at /api-docs for interactive API exploration.
- Seed script for deterministic onboarding and quick local verification.
