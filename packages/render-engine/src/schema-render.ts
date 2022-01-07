import React, { useImperativeHandle } from 'react';

import initCTX from './ctx';
import NodeRender from './node-render';
import deserializeSchema from './deserialize-schema';
import type { InitProps, RenderEngineCTX } from './types';

function SchemaRender(initProps: InitProps, ref: React.Ref<RenderEngineCTX>): React.ReactElement | null {
  const ctx = initCTX(initProps);

  useImperativeHandle(ref, () => ({
    states: ctx.states,
    apiStates: ctx.apiStates,
  }));

  const instantiatedNode = deserializeSchema(initProps.schema.node, ctx);
  if (!instantiatedNode) {
    // TODO: paint error
    return null;
  }

  return React.createElement(NodeRender, { node: instantiatedNode, ctx });
}

export default React.forwardRef<RenderEngineCTX, InitProps>(SchemaRender);
