# Zorvyn Finance Backend

Express + MongoDB backend for role-based financial tracking and analytics.

## Overview

This project provides:

- JWT authentication
- Role-based access control (viewer, analyst, admin)
- Financial records CRUD with filtering and pagination
- Dashboard analytics using MongoDB aggregation
- Request validation and centralized error handling
- Swagger/OpenAPI documentation

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Joi
- JSON Web Token (JWT)
- Swagger UI + swagger-jsdoc

## Core Features

- Auth: register and login with JWT token issuance
- RBAC: route-level authorization by role
- Records: create, update, delete, and query records with filters
- Dashboard: summary, category split, monthly trends, combined metrics

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a .env file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zorvyn
JWT_SECRET=replace-with-a-strong-secret
NODE_ENV=development
```

### 3. Seed sample data (optional)

```bash
npm run seed
```

### 4. Run the application

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:5000/
```

## API Documentation

- Swagger UI: http://localhost:5000/api-docs
- API reference file: [API.md](API.md)

## Project Structure

```text
src/
   config/        # Database and Swagger setup
   controllers/   # Request handlers
   middleware/    # Auth, RBAC, global error handler
   models/        # Mongoose schemas
   routes/        # Route registration
   utils/         # Validation schemas
server.js        # App bootstrap
seed.js          # Database seed script
```

## Architecture (Brief)

Request flow:

route -> middleware -> controller -> model -> response

Analytics endpoints use MongoDB aggregation pipelines for server-side computation.

Detailed design is in [ARCHITECTURE.md](ARCHITECTURE.md).
