import { Set } from 'immutable';
import { BehaviorSubject } from 'rxjs';
import { NodePrimary } from '../types';
import { getNodeExecutor } from './utils';

export const isNodeSupportChildrenCache: Map<string, boolean> = new Map();
export const isModalLayerNodeCache: Map<string, boolean> = new Map();
export const modalLayerNodeExecutors$ = new BehaviorSubject<Set<string>>(Set());

export function _cacheIsNodeSupportChildren(node: NodePrimary, isSupport: boolean): void {
  const cacheKey = getNodeExecutor(node);

  isNodeSupportChildrenCache.set(cacheKey, isSupport);
}

export function _checkIfNodeSupportChildren(node: NodePrimary): boolean | undefined {
  return isNodeSupportChildrenCache.get(getNodeExecutor(node));
}

export function _cacheNodeIsModalLayer(node: NodePrimary, flag: boolean): void {
  const executor = getNodeExecutor(node);
  isModalLayerNodeCache.set(executor, flag);
  if (flag) {
    modalLayerNodeExecutors$.next(modalLayerNodeExecutors$.value.add(executor));
  }
}

export function _checkIfNodeIsModalLayer(node: NodePrimary): boolean | undefined {
  return isModalLayerNodeCache.get(getNodeExecutor(node));
}
