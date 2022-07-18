import type { Artery } from '@one-for-all/artery';

const todoWithEditor: Artery = {
  node: {
    id: 'todo-with-editor',
    type: 'html-element',
    name: 'div',
    props: {
      style: {
        type: 'constant_property',
        value: {
          display: 'grid',
          gridTemplateColumns: '550px 1fr',
          gridGap: '60px',
        }
      }
    },
    children: [
      {
        id: 'todo-app-render-wrapper',
        type: 'html-element',
        name: 'div',
        children: [
          {
            id: 'todo-app-render',
            type: 'react-component',
            packageName: 'todo-with-editor',
            exportName: 'TodoRender',
            packageVersion: 'whatever',
            props: {
              artery: {
                type: 'shared_state_property',
                stateID: 'artery',
                fallback: '',
              }
            }
          },
        ],
      },
      {
        id: 'editor-wrapper',
        type: 'html-element',
        name: 'div',
        children: [
          {
            id: 'desc',
            type: 'html-element',
            name: 'div',
            props: {
              children: {
                type: 'constant_property',
                value: '编辑下方 Artery，在左侧预览渲染结果。'
              }
            },
          },
          {
            id: 'artery-spec-link',
            type: 'html-element',
            name: 'a',
            props: {
              target: {
                type: 'constant_property',
                value: '_blank'
              },
              href: {
                type: 'constant_property',
                value: 'https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery',
              },
              children: {
                type: 'constant_property',
                value: '查看 Artery Spec'
              }
            },
          },
          {
            id: 'editor',
            type: 'react-component',
            packageName: 'todo-with-editor',
            exportName: 'Editor',
            packageVersion: 'whatever',
            props: {
              onChange: {
                type: 'functional_property',
                func: {
                  type: '',
                  args: 'v',
                  body: 'this.states.artery = v'
                }
              }
            }
          },
        ]
      },
    ]
  }
}

export default todoWithEditor;
