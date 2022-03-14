import React from 'react';
import { render } from '@testing-library/react';

import NodeRender from '..';
import initCTX from '../../ctx';
import { Props } from '../index';

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
    location: {
      pathname: '/test1', // default pathname is '/'
      hash: '',
      search: '',
      state: '',
      key: 'default'
    }
  };

  const props: Props = {
    ctx,
    node: {
      id: 'test1',
      type: 'route-node',
      path: '/test1',
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
      id: 'test2',
      type: 'route-node',
      path: '/test2',
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
    location: {
      pathname: '/b', // default pathname is '/'
      hash: '',
      search: '',
      state: '',
      key: 'default'
    }
  };

  const props: Props = {
    ctx: ctx,
    node: { 
      id: 'test3', 
      type: 'html-element', 
      name: 'div',
      children: [
        {
          id: 'a',
          type: 'route-node',
          path: '/a',
          node: {
            id: 'aa',
            type: 'html-element',  
            name: 'i',
          }
        },
        {
          id: 'b',
          type: 'route-node',
          path: 'b',
          node: {
            id: '/bb',
            type: 'html-element',  
            name: 'div',
            children: [
              {
                id: 'bbb',
                type: 'html-element',
                name: 'span',
                children: [
                  {
                    id: 'bbbb',
                    type: 'route-node',
                    path: '/bbb',
                    node: {
                      id: '_bbbb',
                      type: 'html-element',
                      name: 'i',
                    }
                  },
                ]
              }
            ]
          }
        },
        {
          id: 'c',
          type: 'route-node',
          path: 'c',
          node: {
            id: 'cc',
            type: 'html-element',  
            name: 'li',
          }
        },
      ]
    },
  };

  const { container } = render(<NodeRender {...props} />);
  expect(container).toMatchSnapshot();
});
