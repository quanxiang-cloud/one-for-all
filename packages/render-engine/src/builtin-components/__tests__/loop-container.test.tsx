import React from 'react';
import { render } from '@testing-library/react';
import { logger } from '@ofa/utils';

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
      id: 'loop-item',
      name: 'div',
      props: {},
    },
  };

  const { container } = render((<LoopContainer {...props} />));

  expect(container).toMatchSnapshot();
});

test('LoopContainer_should_log_error_when_iterableState_is_not_iterable', () => {
  const schema: Schema = {
    node: { id: 'some_node', type: NodeType.HTMLNode, name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const apiSpecAdapter: APISpecAdapter = {
    build: () => ({ url: '/api', method: 'get' }),
  };

  const ctx = initCTX({ schema, apiSpecAdapter });
  ctx.statesHubShared.mutateState('not_arr', { id: 'abc' });

  const props: Props = {
    ctx: ctx,
    iterableState: {
      type: NodePropType.SharedStateProperty,
      stateID: 'not_arr',
      fallback: [],
    },
    loopKey: 'id',
    toProps: (item: any) => ({ id: item.id }),
    node: {
      type: NodeType.HTMLNode,
      id: 'loop-item',
      name: 'div',
      props: {},
    },
  };

  render((<LoopContainer {...props} />));

  expect(logger.error).toBeCalled();
});

// todo test case about primary value iteration
test('LoopContainer_resolve_items', () => {
  const schema: Schema = {
    node: { id: 'some_node', type: NodeType.HTMLNode, name: 'div', props: {} },
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
      id: 'loop-item',
      name: 'div',
      props: {},
    },
  };

  const { container } = render((<LoopContainer {...props} />));

  expect(container).toMatchSnapshot();
});
