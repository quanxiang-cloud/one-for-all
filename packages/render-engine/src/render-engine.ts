import React from 'react';
import ReactDOM from 'react-dom';
import type { Schema } from '@one-for-all/schema-spec';

import NodeRender from './node-render';
import bootUp from './boot-up';
import type { Plugins } from './types';

export default class RenderEngine {
  private schema: Schema;
  private plugins: Plugins;

  public constructor(schema: Schema, plugins?: Plugins) {
    this.schema = schema;
    this.plugins = plugins || {};
  }

  public async render(renderRoot: Element): Promise<void> {
    const { ctx, rootNode } = await bootUp({
      plugins: this.plugins,
      schema: this.schema,
    });

    ReactDOM.render(React.createElement(NodeRender, { node: rootNode, ctx }), renderRoot);
  }
}
