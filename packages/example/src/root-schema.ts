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
        children: [
          {
            id: 'home-link',
            type: 'html-element',
            name: 'a',
            isLink: true,
            props: {
              href: {
                type: 'constant_property',
                value: '/'
              },
              style: {
                type: 'constant_property',
                value: {
                  marginRight: '20px',
                }
              }
            },
            children: [
              {
                id: 'home-page',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: '主页'
                  }
                }
              }
            ]
          },
          {
            id: 'todo-link',
            type: 'html-element',
            name: 'a',
            isLink: true,
            props: {
              href: {
                type: 'constant_property',
                value: '/todo'
              },
              style: {
                type: 'constant_property',
                value: {
                  marginRight: '20px',
                }
              }
            },
            children: [
              {
                id: 'todo-page',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: 'Todo App'
                  }
                }
              }
            ]
          },
          {
            id: 'about-link',
            type: 'html-element',
            name: 'a',
            isLink: true,
            props: {
              href: {
                type: 'constant_property',
                value: '/about'
              },
              style: {
                type: 'constant_property',
                value: {
                  marginRight: '20px',
                }
              }
            },
            children: [
              {
                id: 'about-page',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: 'About'
                  }
                }
              }
            ]
          }
        ]
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
