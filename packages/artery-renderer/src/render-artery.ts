import React from 'react';
import ReactDOM from 'react-dom';
import type { Artery } from '@one-for-all/artery';

import NodeRender from './node-render';
import bootUp from './boot-up';
import { CTXContext } from './use-ctx';
import type { Plugins } from './types';

export default class RenderArtery {
  private artery: Artery;
  private plugins: Plugins;

  public constructor(artery: Artery, plugins?: Plugins) {
    this.artery = artery;
    this.plugins = plugins || {};
  }

  public async render(renderRoot: Element): Promise<void> {
    const { ctx, rootNode } = await bootUp({
      plugins: this.plugins,
      artery: this.artery,
    });

    ReactDOM.render(
      React.createElement(
        CTXContext.Provider,
        { value: ctx },
        React.createElement(NodeRender, { node: rootNode }),
      ),
      renderRoot,
    );
  }
}
