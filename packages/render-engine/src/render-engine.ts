import React from 'react';
import ReactDOM from 'react-dom';
import type { Schema } from '@ofa/schema-spec';

import deserializeSchema from './deserialize-schema';
import NodeRender from './node-render';
import initCTX from './ctx';
import type { InitProps, CTX } from './types';

export default class RenderEngine {
  ctx: CTX;
  schema: Schema;

  constructor(initProps: InitProps) {
    this.schema = initProps.schema;
    this.ctx = initCTX(initProps);
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
