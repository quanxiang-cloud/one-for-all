import { NodePropType, NodeType, Schema } from '@ofa/render-engine';

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
    type: NodeType.HTMLNode,
    name: 'div',
    lifecycleHooks: {
      didMount: {
        type: 'lifecycle_hook_func_spec',
        args: '',
        body: 'this.apiStates[\'全部待办列表\'].fetch();',
      },
    },
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
        id: 'ref-schema',
        type: NodeType.RefNode,
        schemaID: 'whatever',
      },
      {
        id: 'todo-input-html-element',
        type: NodeType.HTMLNode,
        name: 'div',
        props: {
          style: {
            type: NodePropType.ConstantProperty,
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
            type: NodeType.HTMLNode,
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
                type: NodePropType.FunctionalProperty,
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
            type: NodeType.HTMLNode,
            name: 'button',
            props: {
              children: {
                type: NodePropType.ConstantProperty,
                value: 'New Todo By Using sharedState',
              },
              style: {
                type: NodePropType.ConstantProperty,
                value: { width: '180px', textAlign: 'center', textTransform: 'capitalize' },
              },
              onClick: {
                type: NodePropType.FunctionalProperty,
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
        type: NodeType.HTMLNode,
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
            id: 'fancy-input',
            type: NodeType.ReactComponentNode,
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
            id: 'add-todo-btn',
            type: NodeType.HTMLNode,
            name: 'button',
            props: {
              type: { type: NodePropType.ConstantProperty, value: 'submit' },
              children: {
                type: NodePropType.ConstantProperty,
                value: 'New Todo by using NodeState',
              },
              style: {
                type: NodePropType.ConstantProperty,
                value: { width: '180px', textAlign: 'center', textTransform: 'capitalize' },
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
        id: 'word_count',
        type: NodeType.HTMLNode,
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
        id: 'refresh-todos',
        type: NodeType.HTMLNode,
        name: 'button',
        props: {
          children: {
            type: NodePropType.ConstantProperty,
            value: 'refresh',
          },
          onClick: {
            type: NodePropType.FunctionalProperty,
            func: {
              type: 'raw',
              args: '',
              body: 'this.apiStates[\'全部待办列表\'].fetch();',
            },
          },
        },
      },
      {
        id: 'todo-list-loop',
        type: NodeType.LoopContainerNode,
        props: {},
        loopKey: 'id',
        iterableState: {
          type: NodePropType.APIResultProperty,
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
          type: NodeType.ReactComponentNode,
          id: 'todo-item',
          packageName: 'todo-app',
          packageVersion: 'whatever',
          exportName: 'TodoItem',
          props: {
            onToggleTodo: {
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
      },
      {
        id: 'todo-filter',
        type: NodeType.ReactComponentNode,
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
