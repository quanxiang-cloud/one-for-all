import { Seq, Stack, Collection } from 'immutable';

import { getChildNodeKey } from './utils';

// type WalkIterator<T, StopValue = unknown> = (
//   accumulator: T | undefined,
//   keyPath: Seq.Indexed<string | number>,
//   stop: (value: StopValue) => StopValue,
// ) => T;

function walk(node, iterator) {
  let stack = Stack.of(Seq([]));
  let reduction;
  let stopped = false;
  function stop(v) {
    stopped = true;
    return v;
  }

  while (!stopped && stack.size > 0) {
    const keyPath = stack.first();

    stack = stack.shift();

    if (!keyPath) {
      continue;
    }

    reduction = iterator(reduction, keyPath, stop);
    const nodeChildrenKey = getChildNodeKey(node.getIn(keyPath));
    if (!nodeChildrenKey) {
      continue;
    }

    const childNodes = node.getIn(keyPath.concat(nodeChildrenKey));
    if (!childNodes) {
      continue;
    }

    if (childNodes.isEmpty()) {
      continue;
    }

    if (Array.isArray(childNodes.toJS())) {
      childNodes.keySeq().forEach((i) => {
        stack = stack.unshift(keyPath.concat([nodeChildrenKey, i]));
      });
      continue;
    }

    stack = stack.unshift(keyPath.concat(nodeChildrenKey));
  }

  return reduction;
}

export default walk;
