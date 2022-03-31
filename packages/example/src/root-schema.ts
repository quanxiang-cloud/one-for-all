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
          },
          {
            id: 'page-engine-route-link-component',
            type: 'react-component',
            packageName: 'page-engine-link',
            exportName: 'RouteLink',
            packageVersion: 'whatever',
            children: [
              {
                id: 'dskjf',
                type: 'html-element',
                name: 'h2',
                props: {
                  children: {
                    type: 'constant_property',
                    value: '想不到吧'
                  }
                }
              }
            ],
            props: {
              style: {
                type: 'constant_property',
                value: {
                  marginRight: '20px',
                },
              },
              id: {
                type: 'constant_property',
                value: 'route-eexix9hx'
              },
              linkType: {
                type: 'constant_property',
                value: 'inside'
              },
              linkUrl: {
                type: 'constant_property',
                value: '/apps/test'
              },
              isBlank: {
                type: 'constant_property',
                value: true,
              },
              onClick: {
                type: 'functional_property',
                func: {
                  type: 'raw',
                  args: 'e',
                  body: `
                    const href = e.currentTarget.href;
                    if (!href) {
                      return;
                    }
                    this.history.push(href);
                  `,
                }
              }
            }
          },
        ]
      },
      {
        id: 'route-for-todo',
        type: 'route-node',
        path: 'todo',
        node: {
          id: 'todo-app-ref',
          type: 'ref-node',
          schemaID: 'SCHEMA_ID_TODO',
          // orphan: true,
        },
      },
      {
        id: 'route-for-page-engine-component',
        type: 'route-node',
        path: 'apps/test',
        node: {
          id: 'apps/test',
          type: 'html-element',
          name: 'span',
          props: {
            children: {
              type: 'constant_property',
              value: '页面引擎路由Link组件的匹配渲染',
            }
          }
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
          schemaID: 'SCHEMA_ID_STYLE_GUIDE',
        },
      },
      {
        id: 'route-for-icon-preview',
        type: 'route-node',
        path: 'icon-preview',
        node: {
          id: 'icon-preview-page',
          type: 'ref-node',
          schemaID: 'SCHEMA_ID_ICON_PREVIEW',
        },
      }
    ]
  }
};

export default rootSchema;
