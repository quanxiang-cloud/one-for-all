import { NodePropType, Schema } from '@ofa/render-engine';

const todoAppSchema: Schema = {
  apiStateSpec: {
    新建待办: { apiID: 'post:/todos' },
    全部待办列表: { apiID: 'get:/todos' },
    更新待办: { apiID: 'put:/todos/{todoId}' },
    todoStatus: { apiID: 'get:/todo_status' },
    删除待办: { apiID: 'delete:/todos/{todoId}' },
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
        key: 'todo-input-html-element',
        type: 'html-element',
        name: 'div',
        props: {
          style: {
            type: NodePropType.ConstantProperty,
            value: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
        },
        children: [
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
                convertor: {
                  type: 'raw',
                  args: 'e',
                  body: 'return e.target.value;',
                },
              },
            },
          },
          {
            key: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              children: {
                type: NodePropType.ConstantProperty,
                value: 'New Todo By Using sharedState',
              },
              style: {
                type: NodePropType.ConstantProperty,
                value: { width: '80px', textAlign: 'center', textTransform: 'capitalize' },
              },
              onClick: {
                type: NodePropType.FunctionalProperty,
                func: {
                  type: 'raw',
                  args: '',
                  body: `
                    const inputValue = this.states.input_value;

                    // todo change this to this.apiState.stateID.fetch(xxx)
                    this.apiStates['新建待办'].fetch(
                      { body: { title: inputValue } },
                      () => this.apiStates['全部待办列表'].refresh(),
                    );
                  `,
                },
              },
            },
          },
        ],
      },
      {
        key: 'todo-input-form',
        type: 'html-element',
        name: 'div',
        props: {
          id: { type: NodePropType.ConstantProperty, value: 'todo-input-form' },
          style: {
            type: NodePropType.ConstantProperty,
            value: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
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
                  body: 'return { body: { title: value } }',
                },
                callback: {
                  type: 'api_fetch_callback',
                  args: '{ result, error }',
                  body: 'this.apiStates["全部待办列表"].refresh()',
                },
              },
            },
          },
          {
            key: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              type: { type: NodePropType.ConstantProperty, value: 'submit' },
              children: {
                type: NodePropType.ConstantProperty,
                value: 'New Todo by using NodeState',
              },
              style: {
                type: NodePropType.ConstantProperty,
                value: { width: '80px', textAlign: 'center', textTransform: 'capitalize' },
              },
              onClick: {
                type: NodePropType.FunctionalProperty,
                func: {
                  type: 'raw',
                  args: '',
                  body: `
                    const inputValue = this.states['$fancy-input'];
                    this.apiStates['新建待办'].fetch(
                      { body: { title: inputValue } },
                      () => this.apiStates['全部待办列表'].refresh(),
                    );
                  `,
                },
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
            convertor: {
              type: 'state_convert_expression',
              expression: '`you have input ${state.split(\' \').length} words`',
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
            type: NodePropType.APIResultProperty,
            stateID: '全部待办列表',
            fallback: [],
            convertor: {
              type: 'state_convert_expression',
              expression: 'state',
            },
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
            callback: {
              type: 'api_fetch_callback',
              args: '{ result, error }',
              body: `
                // 提供一个 refresh event？
                this.apiStates['全部待办列表'].refresh();
                this.apiStates.todoStatus.refresh();
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
            callback: {
              type: 'api_fetch_callback',
              args: '{ result, error }',
              body: `
                this.apiStates['全部待办列表'].refresh();
                this.apiStates.todoStatus.refresh();
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
            type: NodePropType.APIResultProperty,
            stateID: 'todoStatus',
            fallback: 0,
            convertor: {
              type: 'state_convertor_func_spec',
              args: 'state',
              body: `
                return state?.all || 0;
              `,
            },
          },
          working: {
            type: NodePropType.APIResultProperty,
            stateID: 'todoStatus',
            fallback: 0,
            // convertor: (apiState: APIState): number => {
            //   return data?.working || 0;
            // },
            convertor: {
              type: 'state_convertor_func_spec',
              args: 'state',
              body: `
                return state?.working || 0;
              `,
            },
          },
          done: {
            type: NodePropType.APIResultProperty,
            stateID: 'todoStatus',
            fallback: 0,
            convertor: {
              type: 'state_convertor_func_spec',
              args: 'state',
              body: `
                return state?.done || 0;
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
