import React, { PropsWithChildren } from 'react';
import { RefLoader, Repository, SchemaRender } from '@one-for-all/render-engine';

import schema from './serialized-schema';
import refSchema from './ref-schema';

const dummyComponent: React.FC<PropsWithChildren<unknown>> = ({ children }): JSX.Element => {
  return <div id="some_dummy_component">{children}</div>;
};

const repository: Repository = {
  'route-render@whatever': {
    Foo: dummyComponent,
  },
};

const refLoader: RefLoader = () => {
  return Promise.resolve({
    schema: refSchema,
  });
};

export default function RenderByEngine(): JSX.Element {
  return React.createElement(SchemaRender, { schema, plugins: { repository, refLoader } });
}
