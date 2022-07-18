import React from 'react';
import { render } from '@testing-library/react';

import { ArteryNode } from '../../types';
import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';
import CustomRender from './fixtures/custom-render';
import NodeRender from '../../node-render';
import { CTXContext } from '../../use-ctx';

dummyCTX.plugins.repository = {
  'testPackage@version': {
    CustomRender: CustomRender,
  },
};

test('useRenderProps_simplest_case', () => {
  const node: ArteryNode = {
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

  const { container } = render(
    <CTXContext.Provider value={dummyCTX}>
      <NodeRender node={node} />
    </CTXContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});
