import React, { useImperativeHandle } from 'react';
import type { Artery } from '@one-for-all/artery';

import NodeRender from './node-render';
import type { Plugins, ArteryRendererCTX } from './types';
import useBootResult from './boot-up/use-boot-up-result';
import { CTXContext } from './use-ctx';

interface Props {
  artery: Artery;
  plugins?: Plugins;
}

function SchemaRender(
  { artery, plugins }: Props,
  ref: React.Ref<ArteryRendererCTX | undefined>,
): React.ReactElement {
  const { ctx, rootNode } = useBootResult(artery, plugins) || {};

  useImperativeHandle(
    ref,
    () => {
      if (!ctx) {
        return;
      }

      return { apiStates: ctx.apiStates, states: ctx.states, history: ctx.history };
    },
    [ctx],
  );

  if (!ctx || !rootNode) {
    return React.createElement(React.Fragment);
  }

  return React.createElement(
    CTXContext.Provider,
    { value: ctx },
    React.createElement(NodeRender, { node: rootNode }),
  );
}

export default React.forwardRef<ArteryRendererCTX | undefined, Props>(SchemaRender);
