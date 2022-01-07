import { NodePropType, NodeType, Schema } from '@ofa/render-engine';

const refSchema: Schema = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: {
    id: 'ref-container',
    type: NodeType.HTMLNode,
    name: 'div',
    children: [
      {
        id: 'container',
        type: NodeType.HTMLNode,
        name: 'h1',
        props: {
          id: { type: NodePropType.ConstantProperty, value: 'ref-container' },
          children: { type: NodePropType.ConstantProperty, value: 'Todo Demo for Render Engine' },
        },
      },
    ],
  },
};

export default refSchema;
