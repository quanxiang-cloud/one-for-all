import { Set } from 'immutable';
import { BehaviorSubject } from 'rxjs';

import { NodePrimary } from '../types';
import { getNodeExecutor } from './utils';

export const isNodeSupportChildrenCache: Map<string, boolean> = new Map();
export const modalLayerNodeExecutors$ = new BehaviorSubject<Set<string>>(Set());

export function _cacheIsNodeSupportChildren(node: NodePrimary, isSupport: boolean): void {
  const cacheKey = getNodeExecutor(node);

  isNodeSupportChildrenCache.set(cacheKey, isSupport);
}

export function _checkIfNodeSupportChildren(node: NodePrimary): boolean | undefined {
  return isNodeSupportChildrenCache.get(getNodeExecutor(node));
}

export function _checkIfNodeIsModalLayer(node: NodePrimary): boolean {
  if (node.type !== 'react-component') {
    return false;
  }

  return !!window.__OVER_LAYER_COMPONENTS.find(({ packageName, exportName }) => {
    // todo fixme
    return exportName === node.exportName && packageName === node.packageName;
  });
}
