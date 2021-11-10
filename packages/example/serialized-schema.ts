import { ComponentPropType, Schema } from '@ofa/render-engine';

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
      id: { type: ComponentPropType.ConstantProperty, value: 'container' },
      style: {
        type: ComponentPropType.ConstantProperty,
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
          id: { type: ComponentPropType.ConstantProperty, value: 'todo-input-form' },
          style: {
            type: ComponentPropType.ConstantProperty,
            value: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
          onSubmit: {
            type: ComponentPropType.APIInvokeProperty,
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
              type: { type: ComponentPropType.ConstantProperty, value: 'input' },
              name: { type: ComponentPropType.ConstantProperty, value: 'title' },
              placeholder: { type: ComponentPropType.ConstantProperty, value: 'What do you want to do?' },
              autoComplete: { type: ComponentPropType.ConstantProperty, value: 'off' },
              style: {
                type: ComponentPropType.ConstantProperty,
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
              onChange: {
                type: ComponentPropType.FunctionalProperty,
                func: {
                  type: 'raw',
                  args: 'e',
                  body: `
                    this.localStateContext.getState$('todo_title').next(e.target.value);
                  `,
                },
              },
            },
          },
          {
            key: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              type: { type: ComponentPropType.ConstantProperty, value: 'submit' },
              children: { type: ComponentPropType.ConstantProperty, value: 'add todo' },
              style: {
                type: ComponentPropType.ConstantProperty,
                value: { width: '80px', textAlign: 'center', textTransform: 'capitalize' },
              },
            },
          },
          {
            key: 'shadow_input',
            type: 'html-element',
            name: 'p',
            props: {
              children: {
                type: ComponentPropType.LocalStateProperty,
                stateID: 'todo_title',
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
            type: ComponentPropType.APIDerivedProperty,
            stateID: 'listTodos',
            initialValue: [],
            adapter: {
              type: 'api_state_convertor_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data || [];
              `,
            },
          },
          toggleTodo: {
            type: ComponentPropType.APIInvokeProperty,
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
            type: ComponentPropType.APIInvokeProperty,
            stateID: 'listTodos',
            // convertor: () => undefined,
          },
          onDeleteTodo: {
            type: ComponentPropType.APIInvokeProperty,
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
            type: ComponentPropType.APIDerivedProperty,
            stateID: 'todoStatus',
            initialValue: 0,
            adapter: {
              type: 'api_state_convertor_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data?.all || 0;
              `,
            },
          },
          working: {
            type: ComponentPropType.APIDerivedProperty,
            stateID: 'todoStatus',
            initialValue: 0,
            // convertor: (apiState: APIState): number => {
            //   return data?.working || 0;
            // },
            adapter: {
              type: 'api_state_convertor_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data?.working || 0;
              `,
            },
          },
          done: {
            type: ComponentPropType.APIDerivedProperty,
            stateID: 'todoStatus',
            initialValue: 0,
            adapter: {
              type: 'api_state_convertor_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data?.done || 0;
              `,
            },
          },
          onToggleStatus: {
            type: ComponentPropType.APIInvokeProperty,
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
            type: ComponentPropType.APIInvokeProperty,
            stateID: 'todoStatus',
          },
        },
      },
    ],
  },
};

export default todoAppSchema;
