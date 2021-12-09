import React from 'react';
import { render } from '@testing-library/react';
import { logger } from '@ofa/utils';

import { NodeType, HTMLNode, Instantiated, NodePropType } from '../../types';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import HTMLNodeRender from '../html-node-render';

test('HTMLNodeRender_should_handle_empty_html_tag', () => {
  const node: HTMLNode<Instantiated> = {
    id: 'some_node_id',
    type: NodeType.HTMLNode,
    name: '',
    props: {
      id: {
        type: NodePropType.ConstantProperty,
        value: 'some_id',
      },
      className: {
        type: NodePropType.ConstantProperty,
        value: 'foo bar',
      },
    },
  };

  const { container } = render((<HTMLNodeRender node={node} ctx={dummyCTX} />));

  expect(logger.error).toBeCalled();
  expect(container).toMatchSnapshot();
});

test('HTMLNodeRender_match_snapshots', () => {
  const node: HTMLNode<Instantiated> = {
    id: 'some_node_id',
    type: NodeType.HTMLNode,
    name: 'div',
    props: {
      id: {
        type: NodePropType.ConstantProperty,
        value: 'some_id',
      },
      className: {
        type: NodePropType.ConstantProperty,
        value: 'foo bar',
      },
    },
    children: [
      {
        id: 'child_1',
        type: NodeType.HTMLNode,
        name: 'span',
        children: [
          {
            id: 'child_1',
            type: NodeType.HTMLNode,
            name: 'span',
          },
        ],
      },
      {
        id: 'child_2',
        type: NodeType.HTMLNode,
        name: 'span',
        children: [
          {
            id: 'child_1',
            type: NodeType.HTMLNode,
            name: 'span',
          },
        ],
      },
    ],
  };
  const { container } = render((<HTMLNodeRender node={node} ctx={dummyCTX} />));

  expect(container).toMatchSnapshot();
});
