import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { Schema } from '@one-for-all/schema-spec';
import { logger } from '@one-for-all/utils';

import initCTX from './ctx';
import NodeRender from './node-render';
import type { CTX, Plugins, RenderEngineCTX, SchemaNode } from './types';

interface Props {
  schema: Schema;
  plugins?: Plugins;
}

interface UseCTXResult {
  ctx: CTX;
  rootNode: SchemaNode;
}

function useCTX(schema: Schema, plugins?: Plugins): UseCTXResult | null {
  const [ctx, setCTX] = useState<UseCTXResult | null>(null);

  useEffect(() => {
    // todo parentCTX?
    initCTX({ plugins, schema }).then(setCTX).catch(logger.error);
  }, []);

  return ctx;
}

function SchemaRender(
  { schema, plugins }: Props,
  ref: React.Ref<RenderEngineCTX | undefined>,
): React.ReactElement | null {
  const ctx = useCTX(schema, plugins);

  useImperativeHandle(
    ref,
    () => {
      if (!ctx) {
        return;
      }

      return { apiStates: ctx.ctx.apiStates, states: ctx.ctx.states, history: ctx.ctx.history };
    },
    [ctx],
  );

  if (!ctx) {
    return null;
  }

  return React.createElement(NodeRender, { node: ctx.rootNode, ctx: ctx.ctx });
}

export default SchemaRender;
