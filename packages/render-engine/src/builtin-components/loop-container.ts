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
import { NodeProperties, NodeType } from '..';
import { logger } from '@ofa/utils';

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

type UseMergedPropsListParams = {
  iterableState: IterableState<Instantiated>;
  toProps: (item: unknown) => Record<string, unknown>;
  otherProps: NodeProperties<Instantiated>;
  ctx: CTX;
  loopKey: string;
}

// useMergedPropsList return a list of `props` and `key` which could be used for iteration,
// each `props` merged iterableState and otherProps
function useMergedPropsList(
  { iterableState, toProps, otherProps, ctx, loopKey }: UseMergedPropsListParams,
): Array<[NodeProperties<Instantiated>, React.Key]> {
  const iterable = useIterable(iterableState, ctx);

  return iterable.map((item, index) => {
    // convert iterable to constant property spec for reuse of NodeRender
    const constProps = Object.entries(toProps(item))
      .reduce<Record<string, ConstantProperty>>((constProps, [propName, value]) => {
        constProps[propName] = { type: NodePropType.ConstantProperty, value };

        return constProps;
      }, {});

    return [
      Object.assign({}, otherProps, constProps),
      getAppropriateKey(item, loopKey, index),
    ];
  });
}

export type Props = {
  iterableState: IterableState<Instantiated>;
  loopKey: string;
  toProps: (item: unknown) => Record<string, unknown>;
  node: SchemaNode<Instantiated>;
  ctx: CTX;
  containerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

function LoopContainer(
  { iterableState, loopKey, node, ctx, toProps, containerProps }: Props,
): React.ReactElement {
  const mergedPropsList = useMergedPropsList({
    iterableState,
    toProps,
    ctx,
    loopKey,
    otherProps: node.props,
  });

  return React.createElement(
    'div',
    containerProps,
    mergedPropsList.map(([props, key]): React.ReactElement => {
      const newNode = Object.assign({}, node, { props });

      return React.createElement(NodeRender, { key, node: newNode, ctx });
    }),
  );
}

export default LoopContainer;
