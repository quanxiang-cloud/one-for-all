import React from 'react';
import ReactDOM from 'react-dom';

import deserializeSchema from './deserialize-schema';
import NodeRender from './node-render';
import initCTX from './ctx';
import type { InitProps, CTX, Schema } from './types';

export default class RenderEngine {
  ctx: CTX;
  schema: Schema;

  constructor({ schema, apiSpecAdapter, repository }: InitProps) {
    this.schema = schema;
    this.ctx = initCTX({ schema, apiSpecAdapter, repository });
  }

  render(renderRoot: Element): void {
    const instantiatedNode = deserializeSchema(this.schema.node, this.ctx);
    if (!instantiatedNode) {
      // TODO: paint error
      // return { ctx };
      return;
    }

    ReactDOM.render(React.createElement(NodeRender, { node: instantiatedNode, ctx: this.ctx }), renderRoot);
  }
}
