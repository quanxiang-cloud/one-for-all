import React from 'react';

import {
  CTX,
  Instantiated,
  SchemaNode,
  IterableState,
} from '../types';
import NodeRender from '../node-render';
import { useMergedPropsList } from './helpers';

export type Props = {
  iterableState: IterableState<Instantiated>;
  loopKey: string;
  toProps: (item: unknown) => Record<string, unknown>;
  node: SchemaNode<Instantiated>;
  ctx: CTX;
}

function LoopContainer({ iterableState, loopKey, node, ctx, toProps }: Props): React.ReactElement | null {
  const mergedPropsList = useMergedPropsList({
    iterableState,
    toProps,
    ctx,
    loopKey,
    otherProps: node.props,
  });

  if (!mergedPropsList) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    mergedPropsList.map(([key, props]): React.ReactElement => {
      const newNode = Object.assign({}, node, { props });

      return React.createElement(NodeRender, { key, node: newNode, ctx });
    }),
  );
}

export default LoopContainer;
