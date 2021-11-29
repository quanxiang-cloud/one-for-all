import React from 'react';
import type { APISpecAdapter } from '@ofa/api-spec-adapter';

import type { Schema } from './types';
import initCTX from './ctx';
import NodeRender from './node-render';
import deserializeSchema from './deserialize-schema';

type Props = {
  schema: Schema;
  apiSpecAdapter: APISpecAdapter;
}

// todo forward ref
function SchemaRender({ schema, apiSpecAdapter }: Props): React.ReactElement | null {
  const ctx = initCTX(schema, apiSpecAdapter);

  const instantiatedNode = deserializeSchema({ node: schema.node, ctx });
  if (!instantiatedNode) {
    // TODO: paint error
    return null;
  }

  return React.createElement(NodeRender, { node: instantiatedNode, ctx });
}

export default SchemaRender;
