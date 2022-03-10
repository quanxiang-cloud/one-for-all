import React from 'react';
import { render } from '@testing-library/react';

import { createBrowserHistory } from 'history';

import initCTX from '../../ctx';
import RouteNodeRender, { Props } from '../route-node-render';

test('route_node_render_item', async () => {
  const history = createBrowserHistory({ window });
  const schema: SchemaSpec.Schema = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };

  const ctx = await initCTX({
    apiStateSpec: schema.apiStateSpec,
    sharedStatesSpec: schema.sharedStatesSpec,
    goTo: history.push,
  });
  ctx.goTo?.('/aaa/bbb/test1');
  
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
    ctx: ctx,
    node: {
      id: 'test',
      type: 'route-node',
      path: '/aaa/bbb/test2',
      node: {
        id: 'el',
        type: 'html-element',
        name: 'i',
      }
    },
  };

  const { container } = render(<RouteNodeRender {...props} />);
  expect(container.firstChild).toBeTruthy();
});


test('route_node_render_null', async () => {
  const history = createBrowserHistory({ window });
  const schema: SchemaSpec.Schema = {
    node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };

  const ctx = await initCTX({
    apiStateSpec: schema.apiStateSpec,
    sharedStatesSpec: schema.sharedStatesSpec,
    goTo: history.push,
  });
  ctx.goTo?.('/aaa/bbb');
  
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
        id: 'el',
        type: 'html-element',
        name: 'i',
      }
    },
  };

  const { container } = render(<RouteNodeRender {...props} />);
  expect(container.firstChild).toBeTruthy();
});
