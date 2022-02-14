import React from 'react';
import ReactDOM from 'react-dom';
import type { Schema } from '@one-for-all/schema-spec';

import deserializeSchema from './deserialize-schema';
import NodeRender from './node-render';
import initCTX from './ctx';
import type { InitProps, CTX, SchemaNode } from './types';

export default class RenderEngine {
  ctx: CTX;
  schema: Schema;
  node: SchemaNode | null;

  constructor(initProps: InitProps) {
    this.schema = initProps.schema;
    this.ctx = initCTX(initProps);
    this.node = deserializeSchema(this.schema.node, this.ctx);
  }

  render(renderRoot: Element): void {
    if (!this.node) {
      // TODO: paint error
      // return { ctx };
      return;
    }

    ReactDOM.render(React.createElement(NodeRender, { node: this.node, ctx: this.ctx }), renderRoot);
  }
}
