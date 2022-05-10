import { Set } from 'immutable';
import { BehaviorSubject } from 'rxjs';
import { NodePrimary } from '../types';
import { getNodeExecutor } from './utils';

export const isNodeSupportChildrenCache: Map<string, boolean> = new Map();
export const isModalLayerNodeCache: Map<string, boolean> = new Map();

export function cacheIsNodeSupportChildren(node: NodePrimary, isSupport: boolean): void {
  const cacheKey = getNodeExecutor(node);

  isNodeSupportChildrenCache.set(cacheKey, isSupport);
}

export function checkIfNodeSupportChildren(node: NodePrimary): boolean | undefined {
  return isNodeSupportChildrenCache.get(getNodeExecutor(node));
}

export function cacheNodeIsModalLayer(node: NodePrimary, flag: boolean): void {
  const executor = getNodeExecutor(node);
  isModalLayerNodeCache.set(executor, flag);
  if (flag) {
    modalLayerNodeExecutors$.next(modalLayerNodeExecutors$.value.add(executor));
  }
}

export function checkIfNodeIsModalLayer(node: NodePrimary): boolean | undefined {
  return isModalLayerNodeCache.get(getNodeExecutor(node));
}

export const modalLayerNodeExecutors$ = new BehaviorSubject<Set<string>>(Set());
