import React from 'react';
import { render } from '@testing-library/react';

import { SchemaNode } from '../../types';
import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';
import CustomRender from './fixtures/custom-render';
import NodeRender from '../../node-render';

dummyCTX.plugins.repository = {
  'testPackage@version': {
    CustomRender: CustomRender,
  },
};

test('useRenderProps_simplest_case', () => {
  const node: SchemaNode = {
    id: 'foo',
    type: 'react-component',
    packageName: 'testPackage',
    packageVersion: 'version',
    exportName: 'CustomRender',
    props: {
      itemRender: {
        type: 'render_property',
        adapter: () => {
          return { className: 'foobar' };
        },
        node: {
          id: 'some_item',
          type: 'html-element',
          name: 'div',
        },
      },
    },
  };

  const { container } = render(<NodeRender node={node} ctx={dummyCTX} />);

  expect(container).toMatchSnapshot();
});
