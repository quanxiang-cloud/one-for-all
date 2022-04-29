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
        ],
      },
      {
        id: 'route-for-simulator',
        type: 'route-node',
        path: '/',
        node: {
          id: 'simulator-ref',
          type: 'ref-node',
          arteryID: 'SCHEMA_ID_SIMULATOR',
        },
      },
    ],
  },
};

export default rootSchema;
