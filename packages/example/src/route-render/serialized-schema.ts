import type { Schema } from '@one-for-all/schema-spec';

const todoAppSchema: Schema = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: {
    id: 'test3', 
    type: 'html-element', 
    name: 'div',
    children: [
      {
        id: 'a',
        type: 'route-node',
        path: '/a',
        node: {
          id: 'aa',
          type: 'html-element',  
          name: 'i',
        }
      },
      {
        id: 'b',
        type: 'route-node',
        path: 'b',
        node: {
          id: '/bb',
          type: 'html-element',  
          name: 'div',
          children: [
            {
              id: 'bbb',
              type: 'html-element',
              name: 'span',
              children: [
                {
                  id: 'bbbb',
                  type: 'route-node',
                  path: '/bbb',
                  node: {
                    id: '_bbbb',
                    type: 'html-element',
                    name: 'i',
                  }
                },
              ]
            }
          ]
        }
      },
      {
        id: 'c',
        type: 'route-node',
        path: 'c',
        node: {
          id: 'cc',
          type: 'html-element',  
          name: 'li',
        }
      },
    ]
  },
};

export default todoAppSchema;
