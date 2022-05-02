import { NodeWithoutChild } from '@one-for-all/artery-simulator/lib/types';

export function isSupportChildren(node: NodeWithoutChild): Promise<boolean> {
  return Promise.resolve(true);
}
