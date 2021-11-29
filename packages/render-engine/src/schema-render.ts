import React from 'react';

import initCTX from './ctx';
import NodeRender from './node-render';
import deserializeSchema from './deserialize-schema';
import type { InitProps } from './types';

// todo forward ref
function SchemaRender({ schema, apiSpecAdapter, repository }: InitProps): React.ReactElement | null {
  const ctx = initCTX({ schema, apiSpecAdapter, repository });

  const instantiatedNode = deserializeSchema({ node: schema.node, ctx });
  if (!instantiatedNode) {
    // TODO: paint error
    return null;
  }

  return React.createElement(NodeRender, { node: instantiatedNode, ctx });
}

export default SchemaRender;
