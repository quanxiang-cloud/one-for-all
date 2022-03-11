import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { Schema } from '@one-for-all/schema-spec';
import { logger } from '@one-for-all/utils';

import initCTX from './ctx';
import NodeRender from './node-render';
import deserialize from './deserialize';
import type { CTX, Plugins, RenderEngineCTX, SchemaNode } from './types';

interface Props {
  schema: Schema;
  plugins?: Plugins;
}

function useCTX(schema: Schema, plugins?: Plugins): CTX | null {
  const [ctx, setCTX] = useState<CTX | null>(null);

  useEffect(() => {
    initCTX({
      plugins,
      apiStateSpec: schema.apiStateSpec,
      sharedStatesSpec: schema.sharedStatesSpec,
      // todo parentCTX?
    })
      .then((_ctx) => setCTX(_ctx))
      .catch((err) => {
        logger.error(err);
      });
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

      return { apiStates: ctx.apiStates, states: ctx.states };
    },
    [ctx],
  );

  if (!ctx) {
    return null;
  }

  const instantiatedNode = deserialize(schema.node, ctx) as SchemaNode;
  if (!instantiatedNode) {
    // TODO: paint error
    return null;
  }

  return React.createElement(NodeRender, { node: instantiatedNode, ctx });
}

export default React.forwardRef<RenderEngineCTX | undefined, Props>(SchemaRender);
