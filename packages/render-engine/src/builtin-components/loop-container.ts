import React from 'react';
import {
  ConstantProperty,
  CTX,
  Instantiated,
  NodePropType,
  SchemaNode,
  IterableState,
} from '../types';
import useInstantiateProps from '../use-instantiate-props';

import NodeRender from '../node-render';
import { NodeType } from '..';
import { logger } from '@ofa/utils';

type Props = {
  iterableState: IterableState<Instantiated>;
  loopKey: string;
  toProps: (item: unknown) => Record<string, unknown>;
  node: SchemaNode<Instantiated>;
  ctx: CTX;
}

function useIterable(iterableState: IterableState<Instantiated>, ctx: CTX): Array<unknown> {
  const dummyNode: SchemaNode<Instantiated> = {
    type: NodeType.HTMLNode,
    key: 'dummyLoopContainer',
    name: 'div',
    props: {
      iterable: iterableState,
    },
  };

  const { iterable } = useInstantiateProps(dummyNode, ctx);

  if (!Array.isArray(iterable)) {
    // todo better error tips
    logger.error('state is not iterable');
    return [];
  }

  return iterable;
}

function getAppropriateKey(item: unknown, loopKey: string, index: number): string | number {
  if (typeof item === 'string' || typeof item === 'number') {
    return item;
  }

  if (typeof item === 'undefined' || typeof item === 'function' || typeof item === 'boolean') {
    return index;
  }

  if (typeof item === 'object' && item !== null) {
    // just for override typescript "No index signature" error
    return Reflect.get(item, loopKey);
  }

  return index;
}

function LoopContainer({ iterableState, loopKey, node, ctx, toProps }: Props): React.ReactElement {
  const iterable = useIterable(iterableState, ctx);

  return React.createElement(
    // use div or span?, should be configurable
    'div',
    // todo layout props
    null,
    iterable.map((item, index): React.ReactElement => {
      const constProps = Object.entries(toProps(item))
        .reduce<Record<string, ConstantProperty>>((constProps, [propName, value]) => {
          constProps[propName] = { type: NodePropType.ConstantProperty, value };

          return constProps;
        }, {});

      node.props = Object.assign(node.props, constProps);

      return React.createElement(
        NodeRender,
        { key: getAppropriateKey(item, loopKey, index), node: node, ctx },
      );
    }),
  );
}

export default LoopContainer;
