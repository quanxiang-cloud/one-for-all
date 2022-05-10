import { NodePrimary } from '@one-for-all/artery-simulator';

export function isSupportChildren(node: NodePrimary): Promise<boolean> {
  return Promise.resolve(true);
}

export function isNodeInModalLayer(node: NodePrimary): Promise<boolean> {
  if (node.type === 'react-component' && node.exportName === 'Modal') {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
}
