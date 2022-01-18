import React, { useContext } from 'react';
import { logger } from '@ofa/utils';
import type { ConstantProperty } from '@ofa/schema-spec';

import {
  CTX,
  SchemaNode,
  PlainState,
  NodeProperties,
} from '../types';
import PathContext from '../node-render/path-context';
import useInstantiateProps from '../use-instantiate-props';

export function useIterable(iterableState: PlainState, ctx: CTX): Array<unknown> | null {
  const currentPath = useContext(PathContext);

  const dummyNode: SchemaNode = {
    type: 'html-element',
    id: 'dummyLoopContainer',
    name: 'div',
    props: { iterable: iterableState },
  };

  const { iterable } = useInstantiateProps(dummyNode, ctx);

  if (!Array.isArray(iterable)) {
    const nodeID = currentPath.split('/').pop();
    logger.error(
      'state is not iterable.',
      `LoopContainer node [${nodeID}] require a array type state,`,
      // todo optimize toString of iterable
      `but got: ${iterable},`,
      'please check the follow property spec:\n',
      iterableState,
    );
    return null;
  }

  return iterable;
}

export function getAppropriateKey(item: unknown, loopKey: string, index: number): string | number {
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

export function tryToProps(
  source: unknown,
  index: number,
  toProps: (item: unknown, index: number) => Record<string, unknown>,
  currentPath: string,
): Record<string, unknown> | null {
  try {
    const toPropsResult = toProps(source, index);
    if (typeof toPropsResult !== 'object' && !toPropsResult) {
      logger.error(
        'toProps result should be an object, but got: ${toPropsResult},',
        `please check the toProps spec of node: ${currentPath},`,
        'the corresponding node will be skipped for render.',
      );
      return null;
    }

    return toPropsResult;
  } catch (error) {
    logger.error(
      'An error occurred while calling toProps with the following parameter:',
      source,
      '\n',
      `please check the toProps spec of node: ${currentPath},`,
      'the corresponding node will be skipped for render.',
    );

    return null;
  }
}

type UseMergedPropsListParams = {
  iterableState: PlainState;
  toProps: (item: unknown) => Record<string, unknown>;
  otherProps?: NodeProperties;
  ctx: CTX;
  loopKey: string;
}

// useMergedPropsList return a list of `props` and `key` which could be used for iteration,
// each `props` merged iterableState and otherProps
export function useMergedPropsList(
  { iterableState, toProps, otherProps, ctx, loopKey }: UseMergedPropsListParams,
): Array<[React.Key, NodeProperties]> | null {
  const iterable = useIterable(iterableState, ctx);
  const currentPath = useContext(PathContext);

  if (!iterable) {
    return null;
  }

  return iterable.map<[React.Key, NodeProperties] | null>((item, index) => {
    const convertedProps = tryToProps(item, index, toProps, currentPath);
    if (!convertedProps) {
      return null;
    }

    // convert iterable to constant property spec for reuse of NodeRender
    const constProps = Object.entries(convertedProps)
      .reduce<Record<string, ConstantProperty>>((constProps, [propName, value]) => {
        constProps[propName] = { type: 'constant_property', value };

        return constProps;
      }, {});

    return [
      getAppropriateKey(item, loopKey, index),
      Object.assign({}, otherProps, constProps),
    ];
  }).filter((pair): pair is [React.Key, NodeProperties] => !!pair);
}
