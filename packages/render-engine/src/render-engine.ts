import React from 'react';
import ReactDOM from 'react-dom';
import type { APISpecAdapter } from '@ofa/api-spec-adapter';

import deserializeSchema from './deserialize-schema';
import NodeRender from './node-render';
import initCTX from './ctx';
import type { CTX, Schema } from './types';

type Props = {
  apiSpecAdapter: APISpecAdapter;
  schema: Schema;
}

export default class RenderEngine {
  ctx: CTX;
  schema: Schema;

  constructor({ schema, apiSpecAdapter }: Props) {
    this.schema = schema;
    this.ctx = initCTX(schema, apiSpecAdapter);
  }

  render(renderRoot: Element): void {
    const instantiatedNode = deserializeSchema({ node: this.schema.node, ctx: this.ctx });
    if (!instantiatedNode) {
      // TODO: paint error
      // return { ctx };
      return;
    }

    ReactDOM.render(React.createElement(NodeRender, { node: instantiatedNode, ctx: this.ctx }), renderRoot);
  }
}
