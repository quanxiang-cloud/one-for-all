jest.mock('../../repository');

import React from 'react';
import { render } from '@testing-library/react';

import dummyCTX from '../../boot-up/__tests__/fixtures/dummy-ctx';
import NodeRender from '../index';
import { ArteryNode } from '../../types';
import renderPathRepository from './fixtures/render-path';
import { CTXContext } from '../../use-ctx';

const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }, { id: 'f' }, { id: 'g' }];

test('node_path_match_expect_value', () => {
  dummyCTX.statesHubShared.getState$('list').next(list);
  dummyCTX.plugins.repository = renderPathRepository;

  const node: ArteryNode = {
    id: 'root',
    type: 'html-element',
    name: 'div',
    props: {
      'data-path': {
        type: 'constant_property',
        value: 'root',
      },
    },
    children: [
      {
        id: 'level-1',
        type: 'html-element',
        name: 'div',
        props: {
          'data-path': {
            type: 'constant_property',
            value: 'root/level-1',
          },
        },
        children: [
          {
            id: 'level-2',
            type: 'html-element',
            name: 'div',
            props: {
              'data-path': {
                type: 'constant_property',
                value: 'root/level-1/level-3',
              },
            },
            children: [
              {
                id: 'loop-container',
                type: 'loop-container',
                loopKey: 'id',
                iterableState: {
                  type: 'shared_state_property',
                  stateID: 'list',
                  fallback: [],
                },
                toProps: (state: unknown) => ({ id: `first-loop-${(state as any).id}` }),
                node: {
                  id: 'level-3',
                  type: 'react-component',
                  packageName: 'PathContextTest',
                  packageVersion: 'whatever',
                  exportName: 'RenderPath',
                  children: [
                    {
                      id: 'sub-loop-container',
                      type: 'loop-container',
                      loopKey: 'id',
                      iterableState: {
                        type: 'shared_state_property',
                        stateID: 'list',
                        fallback: [],
                      },
                      toProps: (state: unknown) => ({ id: `second-loop-${(state as any).id}` }),
                      node: {
                        id: 'level-4',
                        type: 'react-component',
                        packageName: 'PathContextTest',
                        packageVersion: 'whatever',
                        exportName: 'RenderPath',
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  };
  const { container } = render(
    <CTXContext.Provider value={dummyCTX}>
      <NodeRender node={node} />
    </CTXContext.Provider>,
  );
  expect(container).toMatchSnapshot();
});
