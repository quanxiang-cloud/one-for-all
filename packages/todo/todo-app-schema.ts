import { RequestParams } from '@ofa/spec-interpreter/src/types';
import { APIState, Schema } from '@ofa/render-engine/src/types';

const todoAppSchema: Schema = {
  stateAPIMap: {
    createTodo: 'createTodo',
    listTodos: 'listTodos',
    updateTodo: 'updateTodo',
    todoStatus: 'todoStatus',
    deleteTodo: 'deleteTodo',
  },
  node: {
    key: 'container',
    type: 'html-element',
    name: 'div',
    props: {
      id: { type: 'constant_property', value: 'container' },
    },
    children: [
      {
        key: 'todo-input-form',
        type: 'html-element',
        name: 'form',
        props: {
          id: { type: 'constant_property', value: 'todo-input-form' },
          onSubmit: {
            type: 'api_invoke_property',
            stateID: 'createTodo',
            // onSubmit => requestParams => run
            convertor: (e: React.FormEvent<HTMLFormElement>): RequestParams | undefined => {
              e.preventDefault();
              e.stopPropagation();

              const formData = new FormData(e.target as HTMLFormElement);
              const body = { title: formData.get('title') };

              return { body };
            },
            onSuccess: (): void => {
              // contexts.store.call refresh again
              // reset form
              const form = document.getElementById('todo-input-form') as HTMLFormElement;
              form?.reset?.();
              window.stateHub.getAction('listTodos')();
            },
          },
        },
        children: [
          {
            key: 'todo-input',
            type: 'html-element',
            name: 'input',
            props: {
              type: { type: 'constant_property', value: 'input' },
              name: { type: 'constant_property', value: 'title' },
              placeholder: { type: 'constant_property', value: 'What do you want to do?' },
            },
          },
          {
            key: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              type: { type: 'constant_property', value: 'submit' },
              children: { type: 'constant_property', value: 'add todo' },
            },
          },
        ],
      },
      {
        key: 'todo-list',
        type: 'react-component',
        packageName: 'todo-app',
        exportName: 'TodoList',
        packageVersion: 'whatever',
        props: {
          todos: {
            type: 'api_derived_property',
            stateID: 'listTodos',
            initialValue: [],
            convertor: (apiState: APIState): Array<any> => {
              return apiState.data || [];
            },
          },
          toggleTodo: {
            type: 'api_invoke_property',
            stateID: 'updateTodo',
            convertor: (todo: any): RequestParams | undefined => {
              return { params: { todoId: todo.id }, body: todo };
            },
            onSuccess: (): void => {
              window.stateHub.getAction('listTodos')();
              window.stateHub.getAction('todoStatus')();
            },
          },
          onFetchTodos: {
            type: 'api_invoke_property',
            stateID: 'listTodos',
            convertor: () => undefined,
          },
          onDeleteTodo: {
            type: 'api_invoke_property',
            stateID: 'deleteTodo',
            convertor: (todoID: number): RequestParams => {
              return { params: { todoId: todoID } };
            },
            onSuccess: (): void => {
              window.stateHub.getAction('listTodos')();
              window.stateHub.getAction('todoStatus')();
            },
          },
        },
      },
      {
        key: 'todo-filter',
        type: 'react-component',
        packageName: 'todo-app',
        exportName: 'TodoFilter',
        packageVersion: 'whatever',
        props: {
          all: {
            type: 'api_derived_property',
            stateID: 'todoStatus',
            initialValue: 0,
            convertor: (apiState: APIState): number => {
              return apiState.data?.all || 0;
            },
          },
          working: {
            type: 'api_derived_property',
            stateID: 'todoStatus',
            initialValue: 0,
            convertor: (apiState: APIState): number => {
              return apiState.data?.working || 0;
            },
          },
          done: {
            type: 'api_derived_property',
            stateID: 'todoStatus',
            initialValue: 0,
            convertor: (apiState: APIState): number => {
              return apiState.data?.done || 0;
            },
          },
          onToggleStatus: {
            type: 'api_invoke_property',
            stateID: 'listTodos',
            convertor: (status: string): RequestParams | undefined => {
              return { params: { status } };
            },
          },
          onFetchStatus: {
            type: 'api_invoke_property',
            stateID: 'todoStatus',
            convertor: () => undefined,
          },
        },
      },
    ],
  },
};

export default todoAppSchema;
