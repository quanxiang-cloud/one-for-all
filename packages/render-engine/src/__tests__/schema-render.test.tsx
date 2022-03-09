import React, { useEffect, useRef, useState } from 'react';
import { render } from '@testing-library/react';
import { APISpecAdapter } from '@one-for-all/api-spec-adapter';
import type * as SchemaSpec from '@one-for-all/schema-spec';

import SchemaRender from '../schema-render';
import { RenderEngineCTX } from '../types';
import { createBrowserHistory } from 'history';
import { act } from 'react-dom/test-utils';

const schema: SchemaSpec.Schema = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: {
    id: 'id',
    type: 'html-element',
    name: 'div',
  },
};

const dummyAdapter: APISpecAdapter = {
  build: () => ({ url: '', method: '' }),
};

const history = createBrowserHistory({ window });

function Dummy(): JSX.Element {
  const ref = useRef<RenderEngineCTX>(null);
  const [state, setState] = useState<RenderEngineCTX | undefined>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    setState(ref.current);
  }, []);

  return (
    <>
      <SchemaRender ref={ref} schema={schema} plugins={{ apiSpecAdapter: dummyAdapter, history }} />
      {state && <div jest-id="state" />}
    </>
  );
}

// test('SchemaRender_should_return_expected_ref', () => {
//   const { container } = render(<Dummy />);
//   expect(container.querySelector('[jest-id="state"]')).toBeTruthy();
// });

test('SchemaRender_should_console_changed', () => {
  const { container } = render(<Dummy />);

  act(() => {
  
  });
});

test('todo', () => {
  expect(true).toBeTruthy();
});
