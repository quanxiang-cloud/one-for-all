import React from 'react';
import { render } from '@testing-library/react';

import { NodePropType, Instantiated, SchemaNode, NodeType } from '../../types';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import CustomRender from './fixtures/custom-render';
import NodeRender from '../../node-render';

dummyCTX.repository = {
  'testPackage@version': {
    CustomRender: CustomRender,
  },
};

test('useRenderProps_simplest_case', () => {
  const node: SchemaNode<Instantiated> = {
    id: 'foo',
    type: NodeType.ReactComponentNode,
    packageName: 'testPackage',
    packageVersion: 'version',
    exportName: 'CustomRender',
    props: {
      itemRender: {
        type: NodePropType.RenderProperty,
        toProps: () => {
          return { className: 'foobar' };
        },
        node: {
          id: 'some_item',
          type: NodeType.HTMLNode,
          name: 'div',
        },
      },
    },
  };

  const { container } = render((<NodeRender node={node} ctx={dummyCTX} />));

  expect(container).toMatchSnapshot();
});
