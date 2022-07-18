import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { logger } from '@one-for-all/utils';
import { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import ArterySpec from '@one-for-all/artery';

import dummyCTX from '../../../boot-up/__tests__/fixtures/dummy-ctx';
import { LoopContainerNode, Repository } from '../../../types';
import bootUp from '../../../boot-up';
import LoopNodeRender from '..';
import LoopContainer, { Props } from '../loop-individual';
import { CTXContext } from '../../../use-ctx';

const dummyComponent: React.FC<PropsWithChildren<unknown>> = (): JSX.Element => {
  return <div id="some_dummy_component"></div>;
};
const repository: Repository = {
  'foo@whatever': {
    Foo: dummyComponent,
  },
};

test('LoopContainer_resolve_empty_value', () => {
  const props: Props = {
    ctx: dummyCTX,
    iterableState: {
      type: 'shared_state_property',
      stateID: 'arr',
      fallback: [],
    },
    loopKey: 'id',
    toProps: (item) => ({ children: item }),
    node: {
      type: 'html-element',
      id: 'loop-item',
      name: 'div',
      props: {},
    },
  };

  const { container } = render(
    <CTXContext.Provider value={dummyCTX}>
      <LoopContainer {...props} />
    </CTXContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});

test('LoopContainer_should_log_error_when_iterableState_is_not_iterable', async () => {
  const artery: ArterySpec.Artery = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const apiSpecAdapter: APISpecAdapter = {
    build: () => ({ url: '/api', method: 'get' }),
  };

  const { ctx } = await bootUp({ artery, plugins: { apiSpecAdapter } });
  ctx.statesHubShared.mutateState('not_arr', { id: 'abc' });

  const props: Props = {
    ctx: ctx,
    iterableState: {
      type: 'shared_state_property',
      stateID: 'not_arr',
      fallback: [],
    },
    loopKey: 'id',
    toProps: (item: any) => ({ id: item.id }),
    node: {
      type: 'html-element',
      id: 'loop-item',
      name: 'div',
      props: {},
    },
  };

  render(
    <CTXContext.Provider value={ctx}>
      <LoopContainer {...props} />
    </CTXContext.Provider>,
  );

  expect(logger.error).toBeCalled();
});

// todo test case about primary value iteration
test('LoopContainer_resolve_items', async () => {
  const artery: ArterySpec.Artery = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const apiSpecAdapter: APISpecAdapter = {
    build: () => ({ url: '/api', method: 'get' }),
  };

  const { ctx } = await bootUp({ artery, plugins: { apiSpecAdapter } });
  ctx.statesHubShared.mutateState('arr', [{ id: 'abc' }, { id: 'def' }]);

  const props: Props = {
    ctx: ctx,
    iterableState: {
      type: 'shared_state_property',
      stateID: 'arr',
      fallback: [],
    },
    loopKey: 'id',
    toProps: (item: any) => ({ id: item.id }),
    node: {
      type: 'html-element',
      id: 'loop-item',
      name: 'div',
      props: {},
    },
  };

  const { container } = render(
    <CTXContext.Provider value={ctx}>
      <LoopContainer {...props} />
    </CTXContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});

test('LoopNode_with_ReactOutLayer_composedNode', async () => {
  const artery: ArterySpec.Artery = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const apiSpecAdapter: APISpecAdapter = {
    build: () => ({ url: '/api', method: 'get' }),
  };

  const { ctx } = await bootUp({ artery, plugins: { apiSpecAdapter, repository } });

  ctx.statesHubShared.mutateState('arr', [
    { id: 'abc', title: 'kk', hobby: ['eat', 'sleep'] },
    // { id: 'def', title: 'mm', hobby: ['sing', 'sport'] },
  ]);

  const loopNode: LoopContainerNode = {
    type: 'loop-container',
    id: 'loop-node',
    iterableState: {
      type: 'shared_state_property',
      stateID: 'arr',
      fallback: [],
    },
    loopKey: 'id',
    node: {
      type: 'composed-node',
      id: 'todo-item',
      outLayer: {
        id: 'some_node_id',
        type: 'react-component',
        packageName: 'foo',
        packageVersion: 'whatever',
        exportName: 'Foo',
      },
      nodes: [
        {
          id: 'todo-toggle',
          type: 'html-element',
          name: 'input',
          props: {
            type: {
              type: 'constant_property',
              value: 'checkbox',
            },
            onChange: {
              type: 'functional_property',
              func: () => {
                console.log('checkbox changed');
              },
            },
          },
          toProps: (item: any) => {
            return { key: item.id };
          },
        },
        {
          id: 'todo-title',
          type: 'html-element',
          name: 'div',
          props: {
            children: {
              type: 'constant_property',
              value: 'kkk',
            },
          },
          toProps: (item: any) => {
            return { name: item.title };
          },
        },
      ],
    },
  };

  const { container } = render(
    <CTXContext.Provider value={ctx}>
      <LoopNodeRender node={loopNode} />
    </CTXContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});

test('LoopNode_with_HTMLOutLayer_composedNode', async () => {
  const artery: ArterySpec.Artery = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const apiSpecAdapter: APISpecAdapter = {
    build: () => ({ url: '/api', method: 'get' }),
  };

  const { ctx } = await bootUp({ artery, plugins: { apiSpecAdapter, repository } });

  ctx.statesHubShared.mutateState('arr', [
    { id: 'abc', title: 'kk', hobby: ['eat', 'sleep'] },
    { id: 'def', title: 'mm', hobby: ['sing', 'sport'] },
  ]);

  const loopNode: LoopContainerNode = {
    type: 'loop-container',
    id: 'loop-node',
    iterableState: {
      type: 'shared_state_property',
      stateID: 'arr',
      fallback: [],
    },
    loopKey: 'id',
    node: {
      type: 'composed-node',
      id: 'todo-item',
      outLayer: {
        id: 'div_outlayer',
        type: 'html-element',
        name: 'div',
        props: {
          id: {
            type: 'constant_property',
            value: '111',
          },
        },
      },
      nodes: [
        {
          id: 'todo-toggle',
          type: 'html-element',
          name: 'input',
          props: {
            type: {
              type: 'constant_property',
              value: 'checkbox',
            },
            onChange: {
              type: 'functional_property',
              func: () => {
                console.log('checkbox changed');
              },
            },
          },
          toProps: (item: any) => {
            return { key: item.id };
          },
        },
        {
          id: 'todo-title',
          type: 'html-element',
          name: 'div',
          props: {
            children: {
              type: 'constant_property',
              value: 'kkk',
            },
          },
          toProps: (item: any) => {
            return { name: item.title };
          },
        },
      ],
    },
  };

  const { container } = render(
    <CTXContext.Provider value={ctx}>
      <LoopNodeRender node={loopNode} />
    </CTXContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});

test('LoopNode_with_ordinaryNode_HTMLNode', async () => {
  const artery: ArterySpec.Artery = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const apiSpecAdapter: APISpecAdapter = {
    build: () => ({ url: '/api', method: 'get' }),
  };

  const { ctx } = await bootUp({ artery: artery, plugins: { apiSpecAdapter, repository } });

  ctx.statesHubShared.mutateState('arr', [
    { id: 'abc', title: 'kk', hobby: ['eat', 'sleep'] },
    { id: 'def', title: 'mm', hobby: ['sing', 'sport'] },
  ]);

  const loopNode: LoopContainerNode = {
    type: 'loop-container',
    id: 'loop-node',
    iterableState: {
      type: 'shared_state_property',
      stateID: 'arr',
      fallback: [],
    },
    loopKey: 'id',
    toProps: (item: any) => ({ id: item.id, children: item.title }),
    node: {
      id: 'todo-title',
      type: 'html-element',
      name: 'div',
      props: {
        children: {
          type: 'constant_property',
          value: 'kkk',
        },
      },
    },
  };

  const { container } = render(
    <CTXContext.Provider value={ctx}>
      <LoopNodeRender node={loopNode} />
    </CTXContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});

test('LoopNode_with_ordinaryNode_ReactNode', async () => {
  const artery: ArterySpec.Artery = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const apiSpecAdapter: APISpecAdapter = {
    build: () => ({ url: '/api', method: 'get' }),
  };

  const { ctx } = await bootUp({ artery, plugins: { apiSpecAdapter, repository } });

  ctx.statesHubShared.mutateState('arr', [
    { id: 'abc', title: 'kk', hobby: ['eat', 'sleep'] },
    { id: 'def', title: 'mm', hobby: ['sing', 'sport'] },
  ]);

  const loopNode: LoopContainerNode = {
    type: 'loop-container',
    id: 'loop-node',
    iterableState: {
      type: 'shared_state_property',
      stateID: 'arr',
      fallback: [],
    },
    loopKey: 'id',
    toProps: (item: any) => ({ id: item.id, children: item.title }),
    node: {
      id: 'react-item',
      type: 'react-component',
      packageName: 'foo',
      packageVersion: 'whatever',
      exportName: 'Foo',
      props: {
        children: {
          type: 'constant_property',
          value: 'kk',
        },
      },
    },
  };

  const { container } = render(
    <CTXContext.Provider value={ctx}>
      <LoopNodeRender node={loopNode} />
    </CTXContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});
