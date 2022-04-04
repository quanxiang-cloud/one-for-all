import React, { useMemo } from 'react';
import { logger } from '@one-for-all/utils';
import type { ConstantProperty } from '@one-for-all/artery';

import NodeRender from '../node-render';
import { CTX, ArteryNode, RenderProperty } from '../types';

type Render = (...args: unknown[]) => React.ReactElement;
type RenderProps = Record<string, Render>;

function buildRender(
  node: ArteryNode,
  ctx: CTX,
  adapter?: (...args: unknown[]) => Record<string, unknown>,
): Render {
  return (...args: unknown[]): React.ReactElement => {
    // convert render args to constant properties for reuse of NodeRender
    let constantProps = {};
    try {
      const customProps = adapter?.(...args) || {};
      if (typeof customProps === 'object') {
        constantProps = Object.entries(customProps).reduce<Record<string, ConstantProperty>>(
          (acc, [key, value]) => {
            acc[key] = { type: 'constant_property', value };
            return acc;
          },
          {},
        );
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

function useRenderProps({ props }: ArteryNode, ctx: CTX): RenderProps {
  return useMemo(() => {
    return Object.entries(props || {})
      .filter((pair): pair is [string, RenderProperty] => {
        return pair[1].type === 'render_property';
      })
      .reduce<RenderProps>((acc, [propName, { adapter, node }]) => {
        acc[propName] = buildRender(node, ctx, adapter);

        return acc;
      }, {});
  }, []);
}

export default useRenderProps;
