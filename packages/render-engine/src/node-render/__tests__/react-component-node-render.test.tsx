import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import ReactComponentNodeRender from '../react-component-node-render';
import { Repository, NodeType, ReactComponentNode, Instantiated } from '../../types';

jest.mock('../../repository');

const dummyComponent: React.FC<PropsWithChildren<unknown>> = ({ children }): JSX.Element => {
  return (<div id="some_dummy_component" >{children}</div>);
};
const repository: Repository = {
  'foo@whatever': {
    Foo: dummyComponent,
  },
};

test('ReactComponentNodeRender_should_return_null_no_component', () => {
  const node: ReactComponentNode<Instantiated> = {
    id: 'some_node_id',
    type: NodeType.ReactComponentNode,
    packageName: 'null',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { container } = render((<ReactComponentNodeRender node={node} ctx={dummyCTX} />));

  expect(container).toBeEmptyDOMElement();
});

test('ReactComponentNodeRender_match_snapshots', () => {
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

test('ReactComponentNodeRender_match_snapshots_with_children', () => {
  dummyCTX.repository = repository;

  const node: ReactComponentNode<Instantiated> = {
    id: 'some_node_id',
    type: NodeType.ReactComponentNode,
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
    children: [
      {
        id: 'span_child',
        type: NodeType.HTMLNode,
        name: 'span',
      },
    ],
  };

  const { container } = render((<ReactComponentNodeRender node={node} ctx={dummyCTX} />));

  expect(container).toMatchSnapshot();
});
