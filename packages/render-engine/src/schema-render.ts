import React, { useEffect, useImperativeHandle, useState } from 'react';
import { BrowserHistory } from 'history';
import { logger } from '@one-for-all/utils';
import type { Schema } from '@one-for-all/schema-spec';

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
      .then(setCTX)
      .catch(logger.error);
  }, []);

  return ctx;
}

function useListenHistory(history?: BrowserHistory) {
  if (!history) {
    return null;
  }

  console.log(history);
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useEffect(() => history.listen(setState), [history]);

  return state;
}

function SchemaRender(
  { schema, plugins }: Props,
  ref: React.Ref<RenderEngineCTX | undefined>,
): React.ReactElement | null {
  const ctx = useCTX(schema, plugins);
  const historyCTX = useListenHistory(plugins?.history);

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
