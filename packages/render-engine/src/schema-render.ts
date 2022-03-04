import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Schema } from '@one-for-all/schema-spec';

import initCTX from './ctx';
import NodeRender from './node-render';
import deserialize from './deserialize';
import type { Plugins, RenderEngineCTX, SchemaNode } from './types';
import { logger } from '@one-for-all/utils';
import { CTX } from '.';

interface Props {
  schema: Schema;
  plugins?: Plugins;
}

function SchemaRender(
  { schema, plugins }: Props,
  ref: React.Ref<RenderEngineCTX | undefined>,
): React.ReactElement | null {
  const ctxRef = useRef<CTX>();
  const [done, setDone] = useState(false);

  useEffect(() => {
    initCTX({
      plugins,
      apiStateSpec: schema.apiStateSpec,
      sharedStatesSpec: schema.sharedStatesSpec,
      // todo parentCTX?
    }).then((ctx) => {
      ctxRef.current = ctx;
      setDone(true);
    }).catch((err) => {
      logger.error(err);
    });
  }, []);


  useImperativeHandle(ref, () => {
    if (!ctxRef.current) {
      return;
    }

    return { apiStates: ctxRef.current.apiStates, states: ctxRef.current.states };
  });

  if (!done || !ctxRef.current) {
    return null;
  }

  const instantiatedNode = deserialize(schema.node, ctxRef.current) as SchemaNode;
  if (!instantiatedNode) {
    // TODO: paint error
    return null;
  }

  return React.createElement(NodeRender, { node: instantiatedNode, ctx: ctxRef.current });
}

export default React.forwardRef<RenderEngineCTX | undefined, Props>(SchemaRender);
