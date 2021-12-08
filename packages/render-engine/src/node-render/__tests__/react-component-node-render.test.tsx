import React from 'react';
import { render } from '@testing-library/react';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import { Repository, NodeType, ReactComponentNode, Instantiated } from '../../types';
import ReactComponentNodeRender from '../react-component-node-render';

jest.mock('../../repository');

test('ReactComponentNodeRender_should_return_null_no_component', () => {
  const node: ReactComponentNode<Instantiated> = {
    id: 'some_node_id',
    type: NodeType.ReactComponentNode,
    packageName: 'null',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  // eslint-disable-next-line no-console
  // console.error = jest.fn(console.log);

  const { container } = render((<ReactComponentNodeRender node={node} ctx={dummyCTX} />));

  // eslint-disable-next-line no-console
  // expect(console.error).toBeCalled();
  expect(container).toBeEmptyDOMElement();
});

test('ReactComponentNodeRender_match_snapshots', () => {
  const dummyComponent = (): JSX.Element => (<div id="some_dummy_component" />);
  const repository: Repository = {
    'foo@whatever': {
      Foo: dummyComponent,
    },
  };

  dummyCTX.repository = repository;

  const node: ReactComponentNode<Instantiated> = {
    id: 'some_node_id',
    type: NodeType.ReactComponentNode,
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { container } = render((<ReactComponentNodeRender node={node} ctx={dummyCTX} />));

  expect(container).toMatchSnapshot();
});
