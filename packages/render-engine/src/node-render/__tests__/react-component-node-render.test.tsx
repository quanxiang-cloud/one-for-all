jest.mock('../../repository');

import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import ReactComponentNodeRender from '../react-component-node-render';
import { Repository, ReactComponentNode } from '../../types';

const dummyComponent: React.FC<PropsWithChildren<unknown>> = ({ children }): JSX.Element => {
  return <div id="some_dummy_component">{children}</div>;
};
const repository: Repository = {
  'foo@whatever': {
    Foo: dummyComponent,
  },
};

test('ReactComponentNodeRender_should_return_null_no_component', () => {
  const node: ReactComponentNode = {
    id: 'some_node_id',
    type: 'react-component',
    packageName: 'null',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { container } = render((<ReactComponentNodeRender node={node} ctx={dummyCTX} />));

  expect(container).toBeEmptyDOMElement();
});

test('ReactComponentNodeRender_match_snapshots', () => {
  dummyCTX.repository = repository;

  const node: ReactComponentNode = {
    id: 'some_node_id',
    type: 'react-component',
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
  };

  const { container } = render(<ReactComponentNodeRender node={node} ctx={dummyCTX} />);

  expect(container).toMatchSnapshot();
});

test('ReactComponentNodeRender_match_snapshots_with_children', () => {
  dummyCTX.repository = repository;

  const node: ReactComponentNode = {
    id: 'some_node_id',
    type: 'react-component',
    packageName: 'foo',
    packageVersion: 'whatever',
    exportName: 'Foo',
    children: [
      {
        id: 'span_child',
        type: 'html-element',
        name: 'span',
      },
    ],
  };

  const { container } = render(<ReactComponentNodeRender node={node} ctx={dummyCTX} />);

  expect(container).toMatchSnapshot();
});
