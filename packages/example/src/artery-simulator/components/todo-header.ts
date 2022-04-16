import type { Artery } from '@one-for-all/artery';

const refSchema: Artery = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: {
    id: 'ref-container',
    type: 'html-element',
    name: 'div',
    children: [
      {
        id: 'container',
        type: 'html-element',
        name: 'h1',
        props: {
          id: { type: 'constant_property', value: 'ref-container' },
          children: { type: 'constant_property', value: 'todos' },
          style: {
            type: 'constant_property',
            value: {
              fontSize: '100px',
              fontWeight: '100',
              textAlign: 'center',
              color: 'rgba(175, 47, 47, 0.15)',
              WebkitTextRendering: 'optimizeLegibility',
              MozTextRendering: 'optimizeLegibility',
              textRendering: 'optimizeLegibility',
            },
          },
        },
      },
      {
        id: 'jsx-node',
        type: 'jsx-node',
        props: {
          count: {
            type: 'api_result_property',
            stateID: '全部待办列表',
            fallback: 0,
            convertor: {
              type: 'state_convert_expression',
              expression: 'state.length',
            },
          },
        },
        jsx: `<p style={{ textAlign: 'right' }}>current list count: {count}</p>`,
      },
    ],
  },
};

export default refSchema;
