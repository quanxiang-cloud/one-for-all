import type { Schema } from '@one-for-all/schema-spec';

const refSchema: Schema = {
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
          children: { type: 'constant_property', value: 'Todo Demo for Render Engine' },
        },
      },
    ],
  },
};

export default refSchema;
