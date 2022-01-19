import type { Schema } from '@ofa/schema-spec';

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
    id: 'container',
    type: 'html-element',
    name: 'div',
    lifecycleHooks: {
      didMount: {
        type: 'lifecycle_hook_func_spec',
        args: '',
        body: 'this.apiStates[\'全部待办列表\'].fetch();',
      },
    },
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
        id: 'ref-schema',
        type: 'ref-node',
        schemaID: 'whatever',
      },
      {
        id: 'todo-input-html-element',
        type: 'html-element',
        name: 'div',
        props: {
          style: {
            type: 'constant_property',
            value: {
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
            },
          },
        },
        children: [
          {
            id: 'todo-input',
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
              onChange: {
                type: 'functional_property',
                func: {
                  type: 'raw',
                  args: 'e',
                  body: `
                    this.states.input_value = e.target.value;
                  `,
                },
              },
            },
          },
          {
            id: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              children: {
                type: 'constant_property',
                value: 'New Todo By Using sharedState',
              },
              style: {
                type: 'constant_property',
                value: { width: '180px', textAlign: 'center', textTransform: 'capitalize' },
              },
              onClick: {
                type: 'functional_property',
                func: {
                  type: 'raw',
                  args: '',
                  body: `
                    const inputValue = this.states.input_value;

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
        id: 'todo-input-form',
        type: 'html-element',
        name: 'div',
        props: {
          id: { type: 'constant_property', value: 'todo-input-form' },
          style: {
            type: 'constant_property',
            value: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
        },
        children: [
          {
            id: 'fancy-input',
            type: 'react-component',
            packageName: 'todo-app',
            exportName: 'TodoInput',
            packageVersion: 'whatever',
            supportStateExposure: true,
            props: {
              onEnter: {
                type: 'api_invoke_property',
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
            id: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              type: { type: 'constant_property', value: 'submit' },
              children: {
                type: 'constant_property',
                value: 'New Todo by using NodeState',
              },
              style: {
                type: 'constant_property',
                value: { width: '180px', textAlign: 'center', textTransform: 'capitalize' },
              },
              onClick: {
                type: 'functional_property',
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
        id: 'word_count',
        type: 'html-element',
        name: 'p',
        props: {
          children: {
            // fancy-input
            type: 'node_state_property',
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
        id: 'refresh-todos',
        type: 'html-element',
        name: 'button',
        props: {
          children: {
            type: 'constant_property',
            value: 'refresh',
          },
          onClick: {
            type: 'functional_property',
            func: {
              type: 'raw',
              args: '',
              body: 'this.apiStates[\'全部待办列表\'].fetch();',
            },
          },
        },
      },
      {
        id: 'simple-condition-render',
        type: 'html-element',
        name: 'button',
        shouldRender: {
          type: 'api_result_property',
          stateID: '全部待办列表',
          fallback: false,
          convertor: {
            type: 'state_convertor_func_spec',
            args: 'state',
            body: `
              return state.length < 4;
            `,
          },
        },
        props: {
          children: {
            type: 'constant_property',
            value: 'simple-condition-render-node',
          },
        },
      },
      {
        id: 'multiple-condition-render',
        type: 'html-element',
        name: 'button',
        shouldRender: {
          type: 'computed_property',
          fallback: false,
          deps: [
            { type: 'api_state', depID: 'todoStatus' },
            { type: 'api_state', depID: '全部待办列表' },
          ],
          convertor: {
            type: 'state_convertor_func_spec',
            args: 'state',
            body: `
              return this.apiStates['全部待办列表']?.result?.length > 4;
            `,
          },
        },
        props: {
          children: {
            type: 'constant_property',
            value: 'multiple-condition-render-node',
          },
        },
      },
      {
        id: 'computed-property-render',
        type: 'html-element',
        name: 'button',
        props: {
          children: {
            type: 'constant_property',
            value: 'AAAA',
          },
          test1: {
            type: 'computed_property',
            fallback: '',
            deps: [
              { type: 'api_state', depID: 'todoStatus' },
              { type: 'api_state', depID: '全部待办列表' },
              { type: 'shared_state', depID: '' },
              { type: 'node_state', depID: '' },
            ],
            convertor: {
              type: 'state_convertor_func_spec',
              args: 'state',
              body: `
                return state[1]?.result?.length;
              `,
            },
          },
          test2: {
            type: 'computed_property',
            deps: [
              { type: 'api_state', depID: 'todoStatus' },
              { type: 'api_state', depID: '全部待办列表' },
            ],
            fallback: '',
            convertor: {
              type: 'state_convertor_func_spec',
              args: 'state',
              body: `
                return state[1]?.result?.length;
              `,
            },
          },
        },
      },
      {
        id: 'todo-list-loop',
        type: 'loop-container',
        props: {},
        loopKey: 'id',
        iterableState: {
          type: 'api_result_property',
          stateID: '全部待办列表',
          fallback: [],
          convertor: {
            type: 'state_convert_expression',
            expression: 'state',
          },
        },
        toProps: {
          type: 'to_props_function_spec',
          args: 'state',
          body: 'return { todo: state };',
        },
        node: {
          type: 'react-component',
          id: 'todo-item',
          packageName: 'todo-app',
          packageVersion: 'whatever',
          exportName: 'TodoItem',
          props: {
            onToggleTodo: {
              type: 'api_invoke_property',
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
            onDeleteTodo: {
              type: 'api_invoke_property',
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
      },
      {
        id: 'todo-list-loop-composedNode',
        type: 'loop-container',
        props: {},
        loopKey: 'id',
        iterableState: {
          type: 'api_result_property',
          stateID: '全部待办列表',
          fallback: [],
          convertor: {
            type: 'state_convert_expression',
            expression: 'state',
          },
        },
        node: {
          id: 'compose-node-container',
          type: 'composed-node',
          outLayer: {
            id: 'todo-item-outLayer',
            type: 'html-element',
            name: 'div',
          },
          children: [
            {
              id: 'todo-toggle',
              type: 'html-element',
              name: 'input',
              toProps: {
                type: 'to_props_function_spec',
                args: 'state',
                body: `
                  return {
                    'data-id': state.id,
                    checked: state.status === "working" ? false : true, 
                  }`,
              },
              props: {
                checked: {
                  type: 'constant_property',
                  value: true,
                },
                type: {
                  type: 'constant_property',
                  value: 'checkbox',
                },
                onChange: {
                  type: 'functional_property',
                  func: {
                    type: 'raw',
                    args: 'e',
                    body: `
                      this.apiStates['更新待办'].fetch(
                        { params: { todoId: e.target.dataset.id } },
                        () => this.apiStates["全部待办列表"].refresh()
                      )`,
                  },
                },
              },
            },
            {
              id: 'todo-title',
              type: 'html-element',
              name: 'span',
              toProps: {
                type: 'to_props_function_spec',
                args: 'state',
                body: `
                  return { 
                    children: state.title,
                  }
                `,
              },
            },
          ],
        },
      },
      {
        id: 'todo-filter',
        type: 'react-component',
        packageName: 'todo-app',
        exportName: 'TodoFilter',
        packageVersion: 'whatever',
        props: {
          all: {
            type: 'api_result_property',
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
            type: 'api_result_property',
            stateID: 'todoStatus',
            fallback: 0,
            convertor: {
              type: 'state_convertor_func_spec',
              args: 'state',
              body: `
                return state?.working || 0;
              `,
            },
          },
          done: {
            type: 'api_result_property',
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
            type: 'api_invoke_property',
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
            type: 'api_invoke_property',
            stateID: 'todoStatus',
          },
        },
      },
    ],
  },
};

export default todoAppSchema;
