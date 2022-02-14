import React, { useImperativeHandle } from 'react';
import type { Schema } from '@one-for-all/schema-spec';

import initCTX from './ctx';
import NodeRender from './node-render';
import deserializeSchema from './deserialize-schema';
import type { Plugins, RenderEngineCTX } from './types';

type Props = {
  schema: Schema;
  plugins?: Plugins;
}

function SchemaRender({ schema, plugins }: Props, ref: React.Ref<RenderEngineCTX>): React.ReactElement | null {
  const ctx = initCTX({
    plugins,
    apiStateSpec: schema.apiStateSpec,
    sharedStatesSpec: schema.sharedStatesSpec,
    // todo parentCTX?
  });

  useImperativeHandle(ref, () => ({
    states: ctx.states,
    apiStates: ctx.apiStates,
  }));

  const instantiatedNode = deserializeSchema(schema.node, ctx);
  if (!instantiatedNode) {
    // TODO: paint error
    return null;
  }

  return React.createElement(NodeRender, { node: instantiatedNode, ctx });
}

export default React.forwardRef<RenderEngineCTX, Props>(SchemaRender);
