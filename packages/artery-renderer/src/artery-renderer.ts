import React, { useEffect, useImperativeHandle } from 'react';
import type { Artery } from '@one-for-all/artery';

import NodeRender from './node-render';
import type { Plugins, ArteryRendererCTX } from './types';
import useBootResult from './boot-up/use-boot-up-result';

interface Props {
  artery: Artery;
  plugins?: Plugins;
}

function SchemaRender(
  { artery, plugins }: Props,
  ref: React.Ref<ArteryRendererCTX | undefined>,
): React.ReactElement | null {
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
    return null;
  }

  return React.createElement(NodeRender, { node: rootNode, ctx: ctx });
}

export default React.forwardRef<ArteryRendererCTX | undefined, Props>(SchemaRender);
