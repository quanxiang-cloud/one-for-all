import { Spec } from '@one-for-all/api-spec-adapter';

const todoSpec: Spec = {
  swagger: '3.0.0',
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
        responses: {
          200: {
            description: 'successful operation',
          },
        },
      },
    },
    '/todos': {
      get: {
        description: 'The list of tasks can be filtered by their status.\n',
        operationId: 'listTodos',
        parameters: [
          {
            in: 'query',
            name: 'status',
            description: 'Filters the tasks by their status',
            // explode: true,
            // required: false,
            // schema: {
            //   enum: [
            //     'done',
            //     'waiting',
            //     'working',
            //     'all',
            //   ],
            //   type: 'string',
            // },
            // style: 'form',
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
          },
          400: {
            description: 'Invalid status value',
          },
        },
        security: [
          {
            todo_auth: ['read:todo'],
          },
        ],
        summary: 'List the available tasks',
        tags: ['tasks'],
      },
      post: {
        operationId: 'createTodo',
        // requestBody: {
        //   $ref: '#/components/requestBodies/inline_object',
        // },
        responses: {
          200: {
            description: 'successful operation',
          },
          405: {
            description: 'Invalid input',
          },
        },
        security: [
          {
            todo_auth: ['write:todo'],
          },
        ],
        summary: 'Create a todo',
        tags: ['tasks'],
      },
    },
    '/todos/{todoId}': {
      delete: {
        description: 'Delete the todo\n',
        operationId: 'deleteTodo',
        parameters: [
          {
            name: 'todoId',
            in: 'path',
            type: 'integer',
            required: true,
            format: 'int64',
            // description: 'The todo identifier',
            // explode: false,
            // required: true,
            // schema: {
            //   format: 'int64',
            //   type: 'integer',
            // },
            // style: 'simple',
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
            todo_auth: ['write:todo'],
          },
        ],
        summary: 'Delete the todo',
        tags: ['tasks'],
      },
      put: {
        description: 'Update the todo title and status\n',
        operationId: 'updateTodo',
        parameters: [
          {
            description: 'The todo identifier',
            in: 'path',
            name: 'todoId',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
          },
          404: {
            description: 'The todo does not exist.\n',
          },
        },
        security: [
          {
            todo_auth: ['write:todo'],
          },
        ],
        summary: 'Update the todo',
        tags: ['tasks'],
      },
    },
  },
};

export default todoSpec;
