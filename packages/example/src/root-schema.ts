import type { Schema } from '@one-for-all/schema-spec';

const rootSchema: Schema = {
  node: {
    id: 'app-root',
    type: 'html-element',
    name: 'div',
    children: [
      {
        id: 'global-header',
        type: 'html-element',
        name: 'div',
        props: {
          children: {
            type: 'constant_property',
            value: 'global header'
          }
        }
      },
      {
        id: 'route-for-todo',
        type: 'route-node',
        path: 'todo',
        node: {
          id: 'todo-app-ref',
          type: 'ref-node',
          schemaID: 'SCHEMA_ID_TODO'
        },
      },
      {
        id: 'route-for-about',
        type: 'route-node',
        path: 'about',
        node: {
          id: 'about-page',
          type: 'html-element',
          name: 'h1',
          props: {
            children: {
              type: 'constant_property',
              value: 'this is about page'
            }
          }
        },
      }
    ]
  }
};

export default rootSchema;
