import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Listener } from 'history';
import type { Schema } from '@one-for-all/schema-spec';
import { logger } from '@one-for-all/utils';

import initCTX, { UseCTXResult } from './ctx';
import NodeRender from './node-render';
import type { Plugins, RenderEngineCTX } from './types';

interface Props {
  schema: Schema;
  plugins?: Plugins;
}

function useRouteState(listener?: (listener: Listener) => void): any {
  if (!listener) {
    return null;
  }

  const [state, setState] = useState({});

  useEffect(() => listener(({location}) => setState(location)), [history]);

  return state;
}


function useCTX(schema: Schema, plugins?: Plugins): UseCTXResult | null {
  const [ctx, setCTX] = useState<UseCTXResult | null>(null);

  useEffect(() => {
    // todo parentCTX?
    initCTX({ plugins, schema })
      .then(setCTX)
      .catch(logger.error);
  }, []);

  const routeState = useRouteState(ctx?.ctx.historyListener);
  
  return useMemo(() => {
    if (!ctx) {
      return null;
    }

    return {
      ctx: {...ctx?.ctx, routeState},
      rootNode: ctx?.rootNode,
    };
  }, [ctx?.ctx, routeState]);
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

      return { apiStates: ctx.ctx.apiStates, states: ctx.ctx.states, routeState: ctx.ctx.routeState };
    },
    [ctx],
  );

  if (!ctx) {
    return null;
  }

  return React.createElement(NodeRender, { node: ctx.rootNode, ctx: ctx.ctx });
}

export default React.forwardRef<RenderEngineCTX | undefined, Props>(SchemaRender);
