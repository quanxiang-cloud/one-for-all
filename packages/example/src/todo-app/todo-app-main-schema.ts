import type { Artery } from '@one-for-all/artery';

const todoAppSchema: Artery = {
  apiStateSpec: {
    postTodo: { apiID: 'post:/todos' },
    全部待办列表: { apiID: 'get:/todos' },
    更新待办: { apiID: 'put:/todos/{todoId}' },
    todoStatus: { apiID: 'get:/todo_status' },
    删除待办: { apiID: 'delete:/todos/{todoId}' },
  },
  sharedStatesSpec: {
    currentTodo: {
      initial: '',
    },
    todoCount: {
      initial: 0,
      initializer: {
        func: {
          type: 'initializer_func_spec',
          args: 'dependencies',
          body: `return dependencies['全部待办列表'].length`,
        },
        dependencies: { 全部待办列表: {} },
      },
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
        body: "this.apiStates['全部待办列表'].fetch();",
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
          borderRadius: '2px',
          // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
          boxShadow:
            'blue 0px 0px 0px 2px inset, rgb(255, 255, 255) 10px -10px 0px -3px, rgb(31, 193, 27) 10px -10px, rgb(255, 255, 255) 20px -20px 0px -3px, rgb(255, 217, 19) 20px -20px, rgb(255, 255, 255) 30px -30px 0px -3px, rgb(255, 156, 85) 30px -30px, rgb(255, 255, 255) 40px -40px 0px -3px, rgb(255, 85, 85) 40px -40px',
        },
      },
    },
    children: [
      {
        id: 'ref-schema',
        type: 'ref-node',
        arteryID: 'SCHEMA_ID_TODO_HEADER',
      },
      {
        id: 'todo-input-container',
        type: 'html-element',
        name: 'div',
        children: [
          {
            id: 'todo-input',
            type: 'react-component',
            packageName: 'todo-app',
            exportName: 'TodoInput',
            packageVersion: 'whatever',
            supportStateExposure: true,
            props: {
              onEnter: {
                type: 'functional_property',
                func: {
                  type: 'raw',
                  args: 'value',
                  body: `
                    const title = value.trim();
                    if (!title) {
                      return;
                    }

                    this.apiStates.postTodo.fetch({ body: { title }}, () => {
                      this.apiStates["全部待办列表"].refresh();
                    })
                  `,
                },
              },
            },
          },
        ],
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
            props: {
              style: {
                type: 'constant_property',
                value: {
                  marginBottom: '8px',
                },
              },
            },
          },
          children: [],
          nodes: [
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
              props: {
                children: {
                  type: 'constant_property',
                  value: 'untitled todo',
                }
              },
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
            {
              id: 'todo-delete',
              type: 'html-element',
              name: 'button',
              props: {
                style: {
                  type: 'constant_property',
                  value: {
                    display: 'inline-block',
                    width: '50px',
                    float: 'right',
                  },
                },
                children: {
                  type: 'constant_property',
                  value: 'X',
                },
                onClick: {
                  type: 'functional_property',
                  func: {
                    type: 'raw',
                    args: 'e',
                    body: `
                      this.apiStates['删除待办'].fetch({ params: { todoId: e.target.id }}, () => {
                        this.apiStates["全部待办列表"].refresh()
                      })
                    `,
                  },
                },
              },
              toProps: {
                type: 'to_props_function_spec',
                args: 'state',
                body: `
                  return {
                    id: state.id,
                  }
                `,
              },
            },
          ],
        },
      },
      {
        id: 'footer',
        type: 'html-element',
        name: 'div',
        props: {
          style: {
            type: 'constant_property',
            value: {
              paddingTop: '16px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
        },
        children: [
          {
            id: 'todo-filter',
            type: 'react-component',
            packageName: 'todo-app',
            exportName: 'TodoFilter',
            packageVersion: 'whatever',
            props: {
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
          // {
          //   id: 'todo-count',
          //   type: 'html-element',
          //   name: 'span',
          //   props: {
          //     children: {
          //       type: 'api_result_property',
          //       stateID: '全部待办列表',
          //       fallback: '',
          //       convertor: {
          //         type: 'state_convert_expression',
          //         expression: '`共 ${state.length} 条记录`'
          //       }
          //     }
          //   }
          // }
        ],
      },
    ],
  },
};

export default todoAppSchema;
