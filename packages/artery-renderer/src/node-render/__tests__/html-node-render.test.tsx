import React from 'react';
import { logger } from '@one-for-all/utils';
import { render } from '@testing-library/react';

import HTMLNodeRender from '../html-node-render';
import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';
import { HTMLNode } from '../../types';
import { CTXContext } from '../../use-ctx';

test('HTMLNodeRender_should_handle_empty_html_tag', () => {
  const node: HTMLNode = {
    id: 'some_node_id',
    type: 'html-element',
    name: '',
    props: {
      id: {
        type: 'constant_property',
        value: 'some_id',
      },
      className: {
        type: 'constant_property',
        value: 'foo bar',
      },
    },
  };

  const { container } = render(
    <CTXContext.Provider value={dummyCTX}>
      <HTMLNodeRender node={node} />
    </CTXContext.Provider>,
  );

  expect(logger.error).toBeCalled();
  expect(container).toMatchSnapshot();
});

test('HTMLNodeRender_match_snapshots', () => {
  const node: HTMLNode = {
    id: 'some_node_id',
    type: 'html-element',
    name: 'div',
    props: {
      id: {
        type: 'constant_property',
        value: 'some_id',
      },
      className: {
        type: 'constant_property',
        value: 'foo bar',
      },
    },
    children: [
      {
        id: 'child_1',
        type: 'html-element',
        name: 'span',
        children: [
          {
            id: 'child_1',
            type: 'html-element',
            name: 'span',
          },
        ],
      },
      {
        id: 'child_2',
        type: 'html-element',
        name: 'span',
        children: [
          {
            id: 'child_1',
            type: 'html-element',
            name: 'span',
          },
        ],
      },
    ],
  };
  const { container } = render(
    <CTXContext.Provider value={dummyCTX}>
      <HTMLNodeRender node={node} />
    </CTXContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});
