import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { Artery } from '@one-for-all/artery';
import { logger } from '@one-for-all/utils';

import NodeRender from './node-render';
import bootUp, { BootResult } from './boot-up';
import type { Plugins, ArteryRendererCTX } from './types';

interface Props {
  artery: Artery;
  plugins?: Plugins;
}

function useBootResult(artery: Artery, plugins?: Plugins): BootResult | undefined {
  const [result, setResult] = useState<BootResult>();

  useEffect(() => {
    let unMounting = false;

    bootUp({ artery, plugins })
      .then((bootResult) => {
        if (!unMounting) {
          setResult(bootResult);
        }
      })
      .catch(logger.error);

    return () => {
      unMounting = true;
    };
  }, [artery]);

  return result;
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
