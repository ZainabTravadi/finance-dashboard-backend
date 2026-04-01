import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial API',
      version: '1.0.0',
      description: 'API documentation for authentication, users, records, and dashboard analytics.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Validation failed' },
          },
        },
        RegisterBody: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        RecordBody: {
          type: 'object',
          required: ['amount', 'type', 'category'],
          properties: {
            amount: { type: 'number', example: 1200 },
            type: { type: 'string', enum: ['income', 'expense'] },
            category: { type: 'string', example: 'salary' },
            date: { type: 'string', format: 'date-time' },
            notes: { type: 'string', example: 'Monthly salary' },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterBody' },
              },
            },
          },
          responses: {
            201: { description: 'User registered' },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginBody' },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Users fetched' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User fetched' }, 404: { description: 'Not found' } },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update user',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User updated' }, 404: { description: 'Not found' } },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User deleted' }, 404: { description: 'Not found' } },
        },
      },
      '/records': {
        get: {
          tags: ['Records'],
          summary: 'Get records with filters and pagination',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['income', 'expense'] } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'Records fetched' } },
        },
        post: {
          tags: ['Records'],
          summary: 'Create record',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RecordBody' },
              },
            },
          },
          responses: { 201: { description: 'Record created' }, 400: { description: 'Validation error' } },
        },
      },
      '/records/{id}': {
        get: {
          tags: ['Records'],
          summary: 'Get record by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Record fetched' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Records'],
          summary: 'Update record',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RecordBody' },
              },
            },
          },
          responses: { 200: { description: 'Record updated' }, 404: { description: 'Not found' } },
        },
        delete: {
          tags: ['Records'],
          summary: 'Delete record',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Record deleted' }, 404: { description: 'Not found' } },
        },
      },
      '/dashboard/summary': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get dashboard summary',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Summary fetched' } },
        },
      },
      '/dashboard/category': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get dashboard categories',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Category breakdown fetched' } },
        },
      },
      '/dashboard/trends': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get dashboard trends',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Trends fetched' } },
        },
      },
      '/dashboard/metrics': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get dashboard metrics',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Metrics fetched' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
