import { logger } from '@ofa/utils';
import React, { useMemo } from 'react';
import { RenderPropertyAdapter } from '../types';

import NodeRender from '../node-render';
import {
  CTX,
  SchemaNode,
  RenderProperty,
  Instantiated,
  ConstantProperty,
  NodePropType,
} from '../types';

type Render = (...args: unknown[]) => React.ReactElement;
type RenderProps = Record<string, Render>;

function buildRender(
  node: SchemaNode<Instantiated>,
  ctx: CTX,
  adapter?: RenderPropertyAdapter<Instantiated>,
): Render {
  return (...args: unknown[]): React.ReactElement => {
    // convert render args to constant properties for reuse of NodeRender
    let constantProps = {};
    try {
      const customProps = adapter?.(...args) || {};
      if (typeof customProps === 'object') {
        constantProps = Object.entries(customProps)
          .reduce<Record<string, ConstantProperty>>((acc, [key, value]) => {
            acc[key] = { type: NodePropType.ConstantProperty, value };
            return acc;
          }, {});
      } else {
        // todo optimize this message
        logger.error('toProps result is no Object');
      }
    } catch (error) {
      // todo optimize this message
      logger.error('failed to call toProps', error);
    }

    node.props = Object.assign({}, node.props, constantProps);

    return React.createElement(NodeRender, { node, ctx });
  };
}

function useRenderProps({ props }: SchemaNode<Instantiated>, ctx: CTX): RenderProps {
  return useMemo(() => {
    return Object.entries(props || {})
      .filter((pair): pair is [string, RenderProperty<Instantiated>] => {
        return pair[1].type === NodePropType.RenderProperty;
      }).reduce<RenderProps>((acc, [propName, { adapter, node }]) => {
        acc[propName] = buildRender(node, ctx, adapter);

        return acc;
      }, {});
  }, []);
}

export default useRenderProps;
