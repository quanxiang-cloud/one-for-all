import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { Schema } from '@one-for-all/schema-spec';
import { logger } from '@one-for-all/utils';

import NodeRender from './node-render';
import bootUp, { BootResult } from './boot-up';
import type { Plugins, RenderEngineCTX } from './types';

interface Props {
  schema: Schema;
  plugins?: Plugins;
}

function useBootResult(schema: Schema, plugins?: Plugins): BootResult | undefined {
  const [result, setResult] = useState<BootResult>();

  useEffect(() => {
    let unMounting = false;

    bootUp({ schema, plugins })
      .then((bootResult) => {
        if (!unMounting) {
          setResult(bootResult);
        }
      })
      .catch(logger.error);

    return () => {
      unMounting = true;
    };
  }, []);

  return result;
}

function SchemaRender(
  { schema, plugins }: Props,
  ref: React.Ref<RenderEngineCTX | undefined>,
): React.ReactElement | null {
  const { ctx, rootNode } = useBootResult(schema, plugins) || {};

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

export default React.forwardRef<RenderEngineCTX | undefined, Props>(SchemaRender);
