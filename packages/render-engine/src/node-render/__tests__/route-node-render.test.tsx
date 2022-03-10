import React from 'react';
import { render } from '@testing-library/react';

import { createBrowserHistory } from 'history';

import initCTX from '../../ctx';
import RouteNodeRender, { Props } from '../route-node-render';
import NodeRender from '..';

// test('route_node_render_item', async () => {
//   const history = createBrowserHistory({ window });
//   const schema: SchemaSpec.Schema = {
//     node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
//     apiStateSpec: {},
//     sharedStatesSpec: {},
//   };

//   const ctx = await initCTX({
//     apiStateSpec: schema.apiStateSpec,
//     sharedStatesSpec: schema.sharedStatesSpec,
//     goTo: history.push,
//   });
//   ctx.goTo?.('/aaa/bbb/test1');
  
//   // to mock latest route state when url change;
//   ctx.routeState = {
//     action: 'push',
//     location: {
//       pathname: '/aaa/bbb/test1', // default pathname is '/'
//       hash: '',
//       search: '',
//       state: '',
//       key: 'default'
//     }
//   };

//   const props: Props = {
//     ctx: ctx,
//     node: {
//       id: 'test',
//       type: 'route-node',
//       path: '/aaa/bbb/test1',
//       node: {
//         id: 'el',
//         type: 'html-element',
//         name: 'i',
//       }
//     },
//   };

//   const { container } = render(<RouteNodeRender {...props} />);
//   expect(container.firstChild).toBeTruthy();
// });


// test('route_node_render_null', async () => {
//   const history = createBrowserHistory({ window });
//   const schema: SchemaSpec.Schema = {
//     node: { id: 'some_node', type: 'html-element', name: 'div', props: {} },
//     apiStateSpec: {},
//     sharedStatesSpec: {},
//   };

//   const ctx = await initCTX({
//     apiStateSpec: schema.apiStateSpec,
//     sharedStatesSpec: schema.sharedStatesSpec,
//     goTo: history.push,
//   });
//   ctx.goTo?.('/aaa/bbb');
  
//   // to mock latest route state when url change;
//   ctx.routeState = {
//     action: 'push',
//     location: {
//       pathname: '/aaa/bbb', // default pathname is '/'
//       hash: '',
//       search: '',
//       state: '',
//       key: 'default'
//     }
//   };

//   const props: Props = {
//     ctx: ctx,
//     node: {
//       id: 'test',
//       type: 'route-node',
//       path: '/aaa/bbb/test2',
//       node: {
//         id: 'iii',
//         type: 'html-element',
//         name: 'i',
//       },
//     },
//   };

//   const { container } = render(<RouteNodeRender {...props} />);
//   expect(container.firstChild).toBeFalsy();
// });

test('route_node_render_nest_node', async () => {
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
      pathname: '/aaa/bbb/test2', // default pathname is '/'
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
      children: [
          {
          id: 'el',
          type: 'route-node',
          path: 'newt',
          node: {
            id: 'qqq',
            type: 'html-element',
            name: 'div',
          },
        },
        {
          id: 'ell',
          type: 'route-node',
          path: 'newtttt',
          node: {
            id: 'qqq1',
            type: 'html-element',
            name: 'div',
          },
        }
      ]
    },
  };

  const { container } = render(<NodeRender {...props} />);
  expect(container.firstChild).toBeFalsy();
});
