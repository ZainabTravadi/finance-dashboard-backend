# 💰 Finance Dashboard Backend

Production-ready Express and MongoDB backend for financial record management and analytics.

## 🧠 Overview

This project provides a secure, modular API for:

- authentication and role-based access control
- financial records lifecycle management
- aggregated dashboard analytics
- consistent validation and error handling

It is designed to be reusable across internal tools, admin platforms, and analytics-driven applications.

## ⚙️ Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Joi
- JSON Web Token (JWT)
- Swagger UI + swagger-jsdoc

## 🔐 Core Features

- Authentication: register and login with JWT token issuance
- Authorization: role-based access control (viewer, analyst, admin)
- Records API: create, read, update, delete, filtering, and pagination
- Dashboard API: summary, category breakdown, monthly trends, and metrics
- Reliability: centralized error middleware and input validation schemas
- Developer experience: Swagger documentation at runtime

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a .env file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 3. Seed sample data (optional)

```bash
npm run seed
```

### 4. Start the server

```bash
npm run dev
```

### 5. Verify health endpoint

```bash
curl http://localhost:5000/
```

## 📘 API Documentation

- Swagger UI: http://localhost:5000/api-docs
- Full endpoint reference: [API.md](API.md)

## 🗂️ Project Structure

```text
src/
   config/         # Database and Swagger configuration
   controllers/    # Request handlers
   middleware/     # Auth, RBAC, and error middleware
   models/         # Mongoose schemas and indexes
   routes/         # HTTP route definitions
   utils/          # Validation schemas and helpers
server.js         # Application bootstrap
seed.js           # Data seeding script
```

## 🏗️ Architecture

Primary request flow:

route -> middleware -> controller -> model -> response

Dashboard endpoints use MongoDB aggregation pipelines for server-side analytics and efficient query execution.

Detailed architecture notes: [ARCHITECTURE.md](ARCHITECTURE.md)
