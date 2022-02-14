import React from 'react';
import ReactDOM from 'react-dom';
import type { Schema } from '@one-for-all/schema-spec';

import deserializeSchema from './deserialize-schema';
import NodeRender from './node-render';
import initCTX from './ctx';
import type { Plugins, CTX, SchemaNode, RenderEngineCTX } from './types';

export default class RenderEngine {
  ctx: CTX;
  schema: Schema;
  node: SchemaNode | null;

  constructor(schema: Schema, plugins?: Plugins) {
    this.schema = schema;
    // todo extract node should be cached
    this.ctx = initCTX({
      plugins,
      apiStateSpec: schema.apiStateSpec,
      sharedStatesSpec: schema.sharedStatesSpec,
    });

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
