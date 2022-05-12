import type { NodePrimary } from '@one-for-all/artery-simulator';

export function isSupportChildren(node: NodePrimary): Promise<boolean> {
  return Promise.resolve(true);
}
