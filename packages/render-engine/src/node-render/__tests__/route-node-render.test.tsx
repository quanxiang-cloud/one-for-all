import React from 'react';
import { render } from '@testing-library/react';

import NodeRender from '..';
import initCTX from '../../ctx';
import { Props } from '../route-node-render';

test('route_node_render_item', async () => {
  const schema: SchemaSpec.Schema = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const { ctx } = await initCTX({
    schema,
    apiStateSpec: {},
    sharedStatesSpec: {},
  });
  
  // to mock latest route state when url change;
  ctx.routeState = {
    action: 'push',
    location: {
      pathname: '/aaa/bbb/test1', // default pathname is '/'
      hash: '',
      search: '',
      state: '',
      key: 'default'
    }
  };

  const props: Props = {
    ctx,
    node: {
      id: 'test',
      type: 'route-node',
      path: '/aaa/bbb/test1',
      node: {
        id: 'el',
        type: 'html-element',
        name: 'i',
      }
    },
  };

  const { container } = render(<NodeRender {...props} />);
  expect(container.childNodes).toBeTruthy();
});

test('route_node_render_null', async () => {
  const schema: SchemaSpec.Schema = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const { ctx } = await initCTX({
    schema,
    apiStateSpec: {},
    sharedStatesSpec: {},
  });
  
  // to mock latest route state when url change;
  ctx.routeState = {
    action: 'push',
    location: {
      pathname: '/aaa/bbb', // default pathname is '/'
      hash: '',
      search: '',
      state: '',
      key: 'default'
    }
  };

  const props: Props = {
    ctx: ctx,
    node: {
      id: 'test',
      type: 'route-node',
      path: '/aaa/bbb/test2',
      node: {
        id: 'iii',
        type: 'html-element',
        name: 'i',
      },
    },
  };

  const { container } = render(<NodeRender {...props} />);
  expect(container.firstChild).toBeFalsy();
});

test('render_nest_route_node_match_element', async () => {
  const schema: SchemaSpec.Schema = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
  const { ctx } = await initCTX({
    schema,
    apiStateSpec: {},
    sharedStatesSpec: {},
  });

  // to mock latest route state when url change;
  ctx.routeState = {
    action: 'push',
    location: {
      pathname: '/aaa/bbb/test2/newtttt/sadnewtttt', // default pathname is '/'
      hash: '',
      search: '',
      state: '',
      key: 'default'
    }
  };

  const props: Props = {
    ctx: ctx,
    node: {
      id: 'A',
      type: 'route-node',
      path: 'aaa/bbb/test2',
      node: {
        id: 'a',
        type: 'html-element',
        name: 'div',
      },
      children: [
          {
          id: 'AA',
          type: 'route-node',
          path: 'newt',
          node: {
            id: 'qqq',
            type: 'html-element',
            name: 'i',
          },
        },
        {
          id: 'AB',
          type: 'route-node',
          path: 'newtttt',
          node: {
            id: 'qqq1',
            type: 'html-element',
            name: 'ul',
          },
          children: [
            {
              id: 'ABC',
              type: 'route-node',
              path: 'sadnewtttt',
              node: {
                id: 'asdqqq1',
                type: 'html-element',
                name: 'li',
              },
            }
          ],
        }
      ]
    },
  };

  const { container } = render(<NodeRender {...props} />);
  expect(container).toMatchSnapshot();
});
