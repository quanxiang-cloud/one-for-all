jest.mock('../hooks/index');

import React from 'react';
import { render } from '@testing-library/react';

import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';
import RefNodeRender from '../ref-node-render';
import { RefNode } from '../../types';
import { CTXContext } from '../../use-ctx';

describe('RefNodeRender_return_null_and_fallback', () => {
  test('return_null_if_schema_is_null_and_fallback_is_null', () => {
    const node: RefNode = {
      id: 'some_node_id',
      type: 'ref-node',
      arteryID: 'undefined',
      fallback: undefined,
    };
    const { container } = render(
      <CTXContext.Provider value={dummyCTX}>
        <RefNodeRender node={node} />
      </CTXContext.Provider>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('return_fallback_if_schema_is_null', () => {
    const node: RefNode = {
      id: 'some_node_id',
      type: 'ref-node',
      arteryID: 'undefined',
      fallback: {
        id: 'fallback',
        type: 'html-element',
        name: 'div',
        props: {
          id: {
            type: 'constant_property',
            value: 'fallback',
          },
        },
      },
    };
    const { container } = render(
      <CTXContext.Provider value={dummyCTX}>
        <RefNodeRender node={node} />
      </CTXContext.Provider>,
    );

    expect(container.querySelector('#fallback')).toBeTruthy();
  });
});

test('RefNodeRender_return_ref_node', () => {
  const node: RefNode = {
    id: 'some_node_id',
    type: 'ref-node',
    arteryID: 'dummy',
    fallback: {
      id: 'fallback',
      type: 'html-element',
      name: 'div',
      props: {
        id: {
          type: 'constant_property',
          value: 'fallback',
        },
      },
    },
  };
  const { container } = render(
    <CTXContext.Provider value={dummyCTX}>
      <RefNodeRender node={node} />
    </CTXContext.Provider>,
  );

  expect(container.querySelector('#dummy')).toBeTruthy();
});
