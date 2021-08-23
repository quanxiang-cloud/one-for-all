import { OpenAPIV3 } from 'openapi-types';

const todoSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    contact: {
      email: 'Stephane.Carrez@gmail.com',
    },
    description: 'Todo API',
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
    termsOfService: 'https://todo.vacs.fr/terms/',
    title: 'Todo API',
    version: '1.0.0',
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
  servers: [
    {
      url: 'https://todo.vacs.fr/v1',
    },
    {
      url: 'http://todo.vacs.fr/v1',
    },
  ],
  security: [
    {
      todo_auth: [],
    },
  ],
  tags: [
    {
      description: 'Tasks',
      name: 'tasks',
    },
  ],
  paths: {
    '/todo_status': {
      get: {
        description: 'get todo status count',
        operationId: 'todoStatus',
      },
    },
    '/todos': {
      get: {
        description: 'The list of tasks can be filtered by their status.\n',
        operationId: 'listTodos',
        parameters: [
          {
            description: 'Filters the tasks by their status',
            explode: true,
            in: 'query',
            name: 'status',
            required: false,
            schema: {
              enum: [
                'done',
                'waiting',
                'working',
                'all',
              ],
              type: 'string',
            },
            style: 'form',
          },
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  items: {
                    $ref: '#/components/schemas/Todo',
                  },
                  type: 'array',
                },
              },
            },
            description: 'successful operation',
          },
          400: {
            description: 'Invalid status value',
          },
        },
        security: [
          {
            todo_auth: [
              'read:todo',
            ],
          },
        ],
        summary: 'List the available tasks',
        tags: [
          'tasks',
        ],
      },
      post: {
        operationId: 'createTodo',
        requestBody: {
          $ref: '#/components/requestBodies/inline_object',
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Todo',
                },
              },
            },
            description: 'successful operation',
          },
          405: {
            description: 'Invalid input',
          },
        },
        security: [
          {
            todo_auth: [
              'write:todo',
            ],
          },
        ],
        summary: 'Create a todo',
        tags: [
          'tasks',
        ],
      },
    },
    '/todos/{todoId}': {
      delete: {
        description: 'Delete the todo\n',
        operationId: 'deleteTodo',
        parameters: [
          {
            description: 'The todo identifier',
            explode: false,
            in: 'path',
            name: 'todoId',
            required: true,
            schema: {
              format: 'int64',
              type: 'integer',
            },
            style: 'simple',
          },
        ],
        responses: {
          204: {
            description: 'No content.\n',
          },
          404: {
            description: 'The todo does not exist.\n',
          },
        },
        security: [
          {
            todo_auth: [
              'write:todo',
            ],
          },
        ],
        summary: 'Delete the todo',
        tags: [
          'tasks',
        ],
      },
      put: {
        description: 'Update the todo title and status\n',
        operationId: 'updateTodo',
        parameters: [
          {
            description: 'The todo identifier',
            explode: false,
            in: 'path',
            name: 'todoId',
            required: true,
            schema: {
              format: 'int64',
              type: 'integer',
            },
            style: 'simple',
          },
        ],
        requestBody: {
          $ref: '#/components/requestBodies/inline_object_1',
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Todo',
                },
              },
            },
            description: 'successful operation',
          },
          404: {
            description: 'The todo does not exist.\n',
          },
        },
        security: [
          {
            todo_auth: [
              'write:todo',
            ],
          },
        ],
        summary: 'Update the todo',
        tags: [
          'tasks',
        ],
      },
    },
  },
  components: {
    requestBodies: {
      inline_object_1: {
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              $ref: '#/components/schemas/inline_object_1',
            },
          },
        },
      },
      inline_object: {
        content: {
          'application/x-www-form-urlencoded': {
            schema: {
              $ref: '#/components/schemas/inline_object',
            },
          },
        },
      },
    },
    schemas: {
      Todo: {
        example: {
          id: 23,
          title: 'Make the FOSDEM presentation',
          description: 'password',
          status: 'working',
          create_date: '2017-12-24T00:00:00.000Z',
        },
        properties: {
          id: {
            description: 'The todo identifier',
            format: 'int64',
            type: 'integer',
          },
          title: {
            description: 'The todo title',
            type: 'string',
          },
          create_date: {
            description: 'The todo creation date',
            format: 'date-time',
            type: 'string',
          },
          done_date: {
            description: 'The todo resolution date',
            format: 'date-time',
            type: 'string',
          },
          status: {
            description: 'The todo state',
            enum: [
              'waiting',
              'working',
              'done',
            ],
            type: 'string',
          },
        },
        required: [
          'create_date',
          'id',
          'status',
          'title',
        ],
        type: 'object',
        xml: {
          name: 'Todo',
        },
      },
      inline_object: {
        properties: {
          title: {
            description: 'The todo title',
            type: 'string',
          },
        },
        required: [
          'title',
        ],
        type: 'object',
      },
      inline_object_1: {
        properties: {
          title: {
            description: 'The todo title',
            type: 'string',
          },
          status: {
            description: 'The todo status',
            enum: [
              'working',
              'waiting',
              'done',
            ],
            type: 'string',
          },
        },
        type: 'object',
      },
    },
    securitySchemes: {
      todo_auth: {
        flows: {
          password: {
            scopes: {
              'write:todo': 'Write a todo',
              'read:todo': 'Read a todo',
            },
            tokenUrl: 'http://localhost:8080/v1/oauth/token',
          },
        },
        type: 'oauth2',
      },
    },
  },
};

export default todoSpec;
