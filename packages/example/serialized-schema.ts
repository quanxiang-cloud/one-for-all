import { Schema } from '@ofa/render-engine/src/types';

const todoAppSchema: Schema = {
  apiStateSpec: {
    createTodo: { operationID: 'createTodo' },
    listTodos: { operationID: 'listTodos' },
    updateTodo: { operationID: 'updateTodo' },
    todoStatus: { operationID: 'todoStatus' },
    deleteTodo: { operationID: 'deleteTodo' },
  },
  localStateSpec: {
    currentTodo: {
      initial: '',
    },
  },
  node: {
    key: 'container',
    type: 'html-element',
    name: 'div',
    props: {
      id: { type: 'constant_property', value: 'container' },
      style: {
        type: 'constant_property',
        value: {
          width: '500px',
          margin: 'auto',
          marginTop: '100px',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '5px 5px 20px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    children: [
      {
        key: 'todo-input-form',
        type: 'html-element',
        name: 'form',
        props: {
          id: { type: 'constant_property', value: 'todo-input-form' },
          style: {
            type: 'constant_property',
            value: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
          onSubmit: {
            type: 'api_invoke_property',
            stateID: 'createTodo',
            paramsBuilder: {
              type: 'param_builder_func_spec',
              args: 'e',
              body: `e.preventDefault();
                e.stopPropagation();

                const formData = new FormData(e.target);
                const body = { title: formData.get('title') };

                return { body };
              `,
            },
            onError: {
              type: 'api_invoke_call_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                // todo show error message, error message should be store in localState
                console.log(error.response);
              `,
            },
            onSuccess: {
              type: 'api_invoke_call_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                // contexts.store.call refresh again
                // reset form
                const form = document.getElementById('todo-input-form');
                form?.reset?.();
                this.apiStateContext.runAction('listTodos');
              `,
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
              autoComplete: { type: 'constant_property', value: 'off' },
              style: {
                type: 'constant_property',
                value: {
                  width: '200px',
                  padding: '16px',
                  border: 'none',
                  background: 'rgba(0, 0, 0, 0.003)',
                  boxShadow: 'inset 0 -2px 1px rgb(0 0 0 / 3%)',
                  flexGrow: '1',
                  outline: 'none',
                },
              },
            },
          },
          {
            key: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              type: { type: 'constant_property', value: 'submit' },
              children: { type: 'constant_property', value: 'add todo' },
              style: {
                type: 'constant_property',
                value: { width: '80px', textAlign: 'center', textTransform: 'capitalize' },
              },
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
            adapter: {
              type: 'api_state_mapper_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data || [];
              `,
            },
          },
          toggleTodo: {
            type: 'api_invoke_property',
            stateID: 'updateTodo',
            // template: ${data.foo}
            paramsBuilder: {
              type: 'param_builder_func_spec',
              args: 'todo',
              body: `
                return { params: { todoId: todo.id }, body: todo };
              `,
            },
            onSuccess: {
              type: 'api_invoke_call_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                // 提供一个 refresh event？
                this.apiStateContext.runAction('listTodos');
                this.apiStateContext.runAction('todoStatus');
              `,
            },
          },
          onFetchTodos: {
            type: 'api_invoke_property',
            stateID: 'listTodos',
            // convertor: () => undefined,
          },
          onDeleteTodo: {
            type: 'api_invoke_property',
            stateID: 'deleteTodo',
            paramsBuilder: {
              type: 'param_builder_func_spec',
              args: 'todoID',
              body: `
                return { params: { todoId: todoID } };
              `,
            },
            onSuccess: {
              type: 'api_invoke_call_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                this.apiStateContext.runAction('listTodos');
                this.apiStateContext.runAction('todoStatus');
              `,
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
            adapter: {
              type: 'api_state_mapper_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data?.all || 0;
              `,
            },
          },
          working: {
            type: 'api_derived_property',
            stateID: 'todoStatus',
            initialValue: 0,
            // convertor: (apiState: APIState): number => {
            //   return data?.working || 0;
            // },
            adapter: {
              type: 'api_state_mapper_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data?.working || 0;
              `,
            },
          },
          done: {
            type: 'api_derived_property',
            stateID: 'todoStatus',
            initialValue: 0,
            adapter: {
              type: 'api_state_mapper_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data?.done || 0;
              `,
            },
          },
          onToggleStatus: {
            type: 'api_invoke_property',
            stateID: 'listTodos',
            paramsBuilder: {
              type: 'param_builder_func_spec',
              args: 'status',
              body: `
                return { params: { status } };
              `,
            },
          },
          onFetchStatus: {
            type: 'api_invoke_property',
            stateID: 'todoStatus',
          },
        },
      },
    ],
  },
};

export default todoAppSchema;
