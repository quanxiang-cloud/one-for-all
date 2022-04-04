import type { Artery } from '@one-for-all/artery';

const rootSchema: Artery = {
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
          style: {
            type: 'constant_property',
            value: {
              display: 'flex',
            },
          },
        },
        children: [
          {
            id: 'home-link',
            type: 'html-element',
            name: 'a',
            isLink: true,
            props: {
              href: {
                type: 'constant_property',
                value: '/',
              },
              style: {
                type: 'constant_property',
                value: {
                  marginRight: '20px',
                },
              },
            },
            children: [
              {
                id: 'home-page',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: '主页',
                  },
                },
              },
            ],
          },
          {
            id: 'todo-link',
            type: 'html-element',
            name: 'a',
            isLink: true,
            props: {
              href: {
                type: 'constant_property',
                value: '/todo',
              },
              style: {
                type: 'constant_property',
                value: {
                  marginRight: '20px',
                },
              },
            },
            children: [
              {
                id: 'todo-page',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: 'Todo App',
                  },
                },
              },
            ],
          },
          {
            id: 'about-link',
            type: 'html-element',
            name: 'a',
            isLink: true,
            props: {
              href: {
                type: 'constant_property',
                value: '/about',
              },
              style: {
                type: 'constant_property',
                value: {
                  marginRight: '20px',
                },
              },
            },
            children: [
              {
                id: 'about-page',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: 'About',
                  },
                },
              },
            ],
          },
          {
            id: 'style-guide-link',
            type: 'html-element',
            name: 'a',
            isLink: true,
            props: {
              href: {
                type: 'constant_property',
                value: '/style-guide',
              },
              style: {
                type: 'constant_property',
                value: {
                  marginRight: '20px',
                },
              },
            },
            children: [
              {
                id: 'style-guide-page',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: 'Style Guide'
                  }
                }
              }
            ]
          },
          {
            id: 'icon-preview',
            type: 'html-element',
            name: 'a',
            isLink: true,
            props: {
              href: {
                type: 'constant_property',
                value: '/icon-preview'
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
                id: 'icon-preview-page',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: 'icon preview'
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
          arteryID: 'SCHEMA_ID_TODO',
          // orphan: true,
        },
      },
      {
        id: 'route-for-about',
        type: 'route-node',
        path: 'about',
        node: {
          id: 'about-page',
          type: 'html-element',
          name: 'div',
          children: [
            {
              id: 'icon',
              type: 'react-component',
              packageName: '@one-for-all/icon',
              packageVersion: 'someversion',
              exportName: 'default',
              props: {
                name: {
                  type: 'constant_property',
                  value: 'accessible',
                },
              },
            },
            {
              id: 'icon',
              type: 'react-component',
              packageName: '@one-for-all/icon',
              packageVersion: 'someversion',
              exportName: 'default',
              props: {
                name: {
                  type: 'constant_property',
                  value: 'account_balance_wallet',
                },
              },
            },
          ],
        },
      },
      {
        id: 'route-for-style-guide',
        type: 'route-node',
        path: 'style-guide',
        node: {
          id: 'style-guide-page',
          type: 'ref-node',
          arteryID: 'SCHEMA_ID_STYLE_GUIDE',
        },
      },
      {
        id: 'route-for-icon-preview',
        type: 'route-node',
        path: 'icon-preview',
        node: {
          id: 'icon-preview-page',
          type: 'ref-node',
          arteryID: 'SCHEMA_ID_ICON_PREVIEW',
        },
      }
    ]
  }
};

export default rootSchema;
