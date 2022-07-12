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
          gridTemplateColumns: 'auto 1fr',
          gridGap: '60px',
        }
      }
    },
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
  }
}

export default todoWithEditor;
