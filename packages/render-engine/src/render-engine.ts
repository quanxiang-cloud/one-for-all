import React from 'react';
import ReactDOM from 'react-dom';
import type { Schema } from '@one-for-all/schema-spec';

import deserialize from './deserialize';
import NodeRender from './node-render';
import initCTX from './ctx';
import type { Plugins, CTX, SchemaNode } from './types';

export default class RenderEngine {
  private schema: Schema;
  private ctx?: CTX;
  private plugins: Plugins;
  // private node: SchemaNode | null;

  public constructor(schema: Schema, plugins?: Plugins) {
    this.schema = schema;
    this.plugins = plugins || {};
  }

  public async render(renderRoot: Element): Promise<void> {
    const ctx = await initCTX({
      plugins: this.plugins,
      apiStateSpec: this.schema.apiStateSpec,
      sharedStatesSpec: this.schema.sharedStatesSpec,
    });

    const node = deserialize(this.schema.node, ctx) as SchemaNode
    if (!node) {
      // TODO: paint error
      // return { ctx };
      return;
    }

    ReactDOM.render(React.createElement(NodeRender, { node, ctx }), renderRoot);
  }
}
