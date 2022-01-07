import React from 'react';
import { render } from '@testing-library/react';

import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import RefNodeRender from '../ref-node-render';
import { Instantiated, NodePropType, NodeType, RefNode } from '../../types';

jest.mock('../hooks');

describe('RefNodeRender_return_null_and_fallback', () => {
  test('return_null_if_schema_is_null_and_fallback_is_null', () => {
    const node: RefNode<Instantiated> = {
      id: 'some_node_id',
      type: NodeType.RefNode,
      schemaID: 'undefined',
      fallback: undefined,
    };
    const { container } = render((<RefNodeRender node={node} ctx={dummyCTX} />));

    expect(container).toBeEmptyDOMElement();
  });

  test('return_fallback_if_schema_is_null', () => {
    const node: RefNode<Instantiated> = {
      id: 'some_node_id',
      type: NodeType.RefNode,
      schemaID: 'undefined',
      fallback: {
        id: 'fallback',
        type: NodeType.HTMLNode,
        name: 'div',
        props: {
          id: {
            type: NodePropType.ConstantProperty,
            value: 'fallback',
          },
        },
      },
    };
    const { container } = render((<RefNodeRender node={node} ctx={dummyCTX} />));

    expect(container.querySelector('#fallback')).toBeTruthy();
  });
});

test('RefNodeRender_return_ref_node', () => {
  const node: RefNode<Instantiated> = {
    id: 'some_node_id',
    type: NodeType.RefNode,
    schemaID: 'dummy',
    fallback: {
      id: 'fallback',
      type: NodeType.HTMLNode,
      name: 'div',
      props: {
        id: {
          type: NodePropType.ConstantProperty,
          value: 'fallback',
        },
      },
    },
  };
  const { container } = render((<RefNodeRender node={node} ctx={dummyCTX} />));

  expect(container.querySelector('#dummy')).toBeTruthy();
});
