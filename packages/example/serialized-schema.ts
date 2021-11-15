import { NodePropType, Schema } from '@ofa/render-engine';

const todoAppSchema: Schema = {
  apiStateSpec: {
    新建待办: { operationID: 'createTodo' },
    全部待办列表: { operationID: 'listTodos' },
    更新待办: { operationID: 'updateTodo' },
    todoStatus: { operationID: 'todoStatus' },
    删除待办: { operationID: 'deleteTodo' },
  },
  sharedStatesSpec: {
    currentTodo: {
      initial: '',
    },
  },
  node: {
    key: 'container',
    type: 'html-element',
    name: 'div',
    props: {
      id: { type: NodePropType.ConstantProperty, value: 'container' },
      style: {
        type: NodePropType.ConstantProperty,
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
          id: { type: NodePropType.ConstantProperty, value: 'todo-input-form' },
          style: {
            type: NodePropType.ConstantProperty,
            value: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
          onSubmit: {
            type: NodePropType.FunctionalProperty,
            func: {
              type: 'raw',
              args: 'e',
              body: 'e.preventDefault();e.stopPropagation()'
            }
          },
          // onSubmit: {
          //   type: ComponentPropType.APIInvokeProperty,
          //   stateID: '新建待办',
          //   paramsBuilder: {
          //     type: 'param_builder_func_spec',
          //     args: 'e',
          //     body: `e.preventDefault();
          //       e.stopPropagation();

          //       const formData = new FormData(e.target);
          //       const body = { title: formData.get('title') };

          //       return { body };
          //     `,
          //   },
          //   onError: {
          //     type: 'api_invoke_call_func_spec',
          //     args: '{ data, error, loading, params }',
          //     body: `
          //       // todo show error message, error message should be store in localState
          //       console.log(error.response);
          //     `,
          //   },
          //   onSuccess: {
          //     type: 'api_invoke_call_func_spec',
          //     args: '{ data, error, loading, params }',
          //     body: `
          //       // contexts.store.call refresh again
          //       // reset form
          //       const form = document.getElementById('todo-input-form');
          //       form?.reset?.();
          //       this.apiStates.refresh('全部待办列表');
          //     `,
          //   },
          // },
        },
        children: [
          {
            key: 'fancy-input',
            type: 'react-component',
            packageName: 'todo-app',
            exportName: 'TodoInput',
            packageVersion: 'whatever',
            supportStateExposure: true,
            props: {
              onEnter: {
                type: NodePropType.APIInvokeProperty,
                stateID: '新建待办',
                paramsBuilder: {
                  type: 'param_builder_func_spec',
                  args: 'value',
                  body: `return { body: { title: value } }`,
                },
                onSuccess: {
                type: 'api_invoke_call_func_spec',
                args: '{ data, error, loading, params }',
                body: `
                  this.apiStates.refresh('全部待办列表');
                `,
              },
              }
            },
          },
          {
            key: 'todo-input',
            type: 'html-element',
            name: 'input',
            props: {
              type: { type: NodePropType.ConstantProperty, value: 'input' },
              name: { type: NodePropType.ConstantProperty, value: 'title' },
              placeholder: { type: NodePropType.ConstantProperty, value: 'What do you want to do?' },
              autoComplete: { type: NodePropType.ConstantProperty, value: 'off' },
              style: {
                type: NodePropType.ConstantProperty,
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
                type: NodePropType.SharedStateMutationProperty,
                stateID: 'input_value',
                adapter: {
                  type: 'raw',
                  args: 'e',
                  body: `return e.target.value;`,
                }
              }
              // onChange: {
              //   type: ComponentPropType.FunctionalProperty,
              //   func: {
              //     type: 'raw',
              //     args: 'e',
              //     body: `
              //       this.sharedStates.getState$('input_value').next(e.target.value);
              //     `,
              //   },
              // },
            },
          },
          {
            key: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              type: { type: NodePropType.ConstantProperty, value: 'submit' },
              children: { type: NodePropType.ConstantProperty, value: 'add todo' },
              style: {
                type: NodePropType.ConstantProperty,
                value: { width: '80px', textAlign: 'center', textTransform: 'capitalize' },
              },
            },
          },
        ],
      },
      {
        key: 'word_count',
        type: 'html-element',
        name: 'p',
        props: {
          children: {
            // fancy-input
            type: NodePropType.NodeStateProperty,
            nodeKey: 'fancy-input',
            // todo replace by $ele-input-xhfsf-todo-input.value
            fallback: 'abv dev',
            adapter: {
              type: 'expression_statement',
              expression: '`you have input ${data.split(\' \').length} words`',
            },
          },
        },
      },
      {
        key: 'todo-list',
        type: 'react-component',
        packageName: 'todo-app',
        exportName: 'TodoList',
        packageVersion: 'whatever',
        supportStateExposure: true,
        props: {
          todos: {
            type: NodePropType.APIDerivedProperty,
            stateID: '全部待办列表',
            fallback: [],
            adapter: {
              type: 'api_state_template',
              template: 'data',
            },
            // adapter: {
            //   type: 'api_state_convertor_func_spec',
            //   args: '{ data, error, loading, params }',
            //   body: `
            //     return data || [];
            //   `,
            // },
          },
          toggleTodo: {
            type: NodePropType.APIInvokeProperty,
            stateID: '更新待办',
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
                this.apiStates.runAction('全部待办列表');
                this.apiStates.runAction('todoStatus');
              `,
            },
          },
          onFetchTodos: {
            type: NodePropType.APIInvokeProperty,
            stateID: '全部待办列表',
          },
          onDeleteTodo: {
            type: NodePropType.APIInvokeProperty,
            stateID: '删除待办',
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
                this.apiStates.runAction('全部待办列表');
                this.apiStates.runAction('todoStatus');
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
            type: NodePropType.APIDerivedProperty,
            stateID: 'todoStatus',
            fallback: 0,
            adapter: {
              type: 'api_state_convertor_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data?.all || 0;
              `,
            },
          },
          working: {
            type: NodePropType.APIDerivedProperty,
            stateID: 'todoStatus',
            fallback: 0,
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
            type: NodePropType.APIDerivedProperty,
            stateID: 'todoStatus',
            fallback: 0,
            adapter: {
              type: 'api_state_convertor_func_spec',
              args: '{ data, error, loading, params }',
              body: `
                return data?.done || 0;
              `,
            },
          },
          onToggleStatus: {
            type: NodePropType.APIInvokeProperty,
            stateID: '全部待办列表',
            paramsBuilder: {
              type: 'param_builder_func_spec',
              args: 'status',
              body: `
                return { params: { status } };
              `,
            },
          },
          onFetchStatus: {
            type: NodePropType.APIInvokeProperty,
            stateID: 'todoStatus',
          },
        },
      },
    ],
  },
};

export default todoAppSchema;
