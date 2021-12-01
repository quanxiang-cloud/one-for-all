import React from 'react';
import { render } from '@testing-library/react';

import LoopContainer, { Props } from '../loop-container';
import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import { NodePropType, NodeType, Schema } from '../../types';
import initCTX from '../../ctx';
import { APISpecAdapter } from '@ofa/api-spec-adapter';

test('LoopContainer_resolve_empty_value', () => {
  const props: Props = {
    ctx: dummyCTX,
    iterableState: {
      type: NodePropType.SharedStateProperty,
      stateID: 'arr',
      fallback: [],
    },
    loopKey: 'id',
    toProps: (item) => ({ children: item }),
    node: {
      type: NodeType.HTMLNode,
      key: 'loop-item',
      name: 'div',
      props: {},
    },
  };

  const { container } = render((<LoopContainer {...props} />));

  expect(container).toMatchSnapshot();
});

test('LoopContainer_resolve_items', () => {
  const schema: Schema = {
    node: { key: 'some_node', type: NodeType.HTMLNode, name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const apiSpecAdapter: APISpecAdapter = {
    build: () => ({ url: '/api', method: 'get' }),
  };

  const ctx = initCTX({ schema, apiSpecAdapter });
  ctx.statesHubShared.mutateState('arr', [{ id: 'abc' }, { id: 'def' }]);

  const props: Props = {
    ctx: ctx,
    iterableState: {
      type: NodePropType.SharedStateProperty,
      stateID: 'arr',
      fallback: [],
    },
    loopKey: 'id',
    toProps: (item: any) => ({ id: item.id }),
    node: {
      type: NodeType.HTMLNode,
      key: 'loop-item',
      name: 'div',
      props: {},
    },
  };

  const { container } = render((<LoopContainer {...props} />));

  expect(container).toMatchSnapshot();
});
