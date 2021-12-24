import React, { useEffect, useRef, useState } from 'react';
import { render } from '@testing-library/react';
import { APISpecAdapter } from '@ofa/api-spec-adapter';

import SchemaRender from '../schema-render';
import { Schema, NodeType, RenderEngineCTX } from '../types';

const schema: Schema = {
  apiStateSpec: {},
  sharedStatesSpec: {},
  node: {
    id: 'id',
    type: NodeType.HTMLNode,
    name: 'div',
  },
};

const dummyAdapter: APISpecAdapter = {
  build: () => ({ url: '', method: '' }),
};

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
      <SchemaRender ref={ref} schema={schema} apiSpecAdapter={dummyAdapter} />
      {state && (<div jest-id="state" />)}
    </>
  );
}

test('SchemaRender_should_return_expected_ref', () => {
  const { container } = render((<Dummy />));

  expect(container.querySelector('[jest-id="state"]')).toBeTruthy();
});
