import React, { useContext } from 'react';

import { CTX, PlainState, ComposedNode, ComposedNodeChild } from '../../types';
import { getAppropriateKey, useIterable, useComposedPropsSpec } from './helpers';
import NodeRender from '../index';
import OutLayerRender from './out-layer-render';
import PathContext from '../path-context';

interface ComposedChildRenderProps {
  node: ComposedNodeChild;
  composedState: unknown;
  ctx: CTX;
  index: number;
}

function ComposedChildRender({
  node,
  composedState,
  ctx,
  index,
}: ComposedChildRenderProps): React.ReactElement {
  const propSpec = useComposedPropsSpec(composedState, node.toProps, index, node.props);
  const _node = Object.assign({}, node, { props: propSpec });
  return React.createElement(NodeRender, { node: _node, ctx });
}

export interface Props {
  iterableState: PlainState;
  loopKey: string;
  node: ComposedNode;
  ctx: CTX;
}

function LoopComposed({ iterableState, loopKey, node, ctx }: Props): React.ReactElement | null {
  const parentPath = useContext(PathContext);
  const iterable = useIterable(iterableState, ctx);

  if (!iterable) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    iterable.map((composedState, index) => {
      const key = getAppropriateKey(composedState, loopKey, index);

      return React.createElement(
        PathContext.Provider,
        { value: `${parentPath}/${node.id}/${index}`, key: index },
        React.createElement(
          OutLayerRender,
          { key, outLayer: node.outLayer, ctx },
          (node.children || node.nodes).map((composedChild, index): React.ReactElement => {
            return React.createElement(ComposedChildRender, {
              node: composedChild,
              composedState,
              ctx,
              index,
              key: composedChild.id,
            });
          }),
        ),
      );
    }),
  );
}

export default LoopComposed;
