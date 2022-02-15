import React, { useContext } from 'react';

import {
  CTX,
  SchemaNode,
  PlainState,
} from '../../types';
import NodeRender from '..';
import { useMergedPropsList } from './helpers';
import PathContext from '../path-context';

export type Props = {
  iterableState: PlainState;
  loopKey: string;
  toProps: (item: unknown) => Record<string, unknown>;
  node: SchemaNode;
  ctx: CTX;
}

function LoopIndividual({ iterableState, loopKey, node, ctx, toProps }: Props): React.ReactElement | null {
  const parentPath = useContext(PathContext);
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
    mergedPropsList.map(([key, props], index): React.ReactElement => {
      const newNode = Object.assign({}, node, { props });

      return React.createElement(
        PathContext.Provider,
        { value: `${parentPath}/${index}`, key },
        React.createElement(NodeRender, { key, node: newNode, ctx })
      );
    }),
  );
}

export default LoopIndividual;
