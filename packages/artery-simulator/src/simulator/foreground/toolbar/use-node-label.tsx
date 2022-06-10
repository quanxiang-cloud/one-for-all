import { useMemo } from 'react';
import { Node } from '@one-for-all/artery';

export function useNodeLabel(node?: Node): string {
  return useMemo(() => {
    if (!node) {
      return 'untitled';
    }

    if (node.label) {
      return node?.label;
    }

    if ('exportName' in node) {
      return node.exportName.toUpperCase();
    }

    if ('name' in node) {
      return node.name.toUpperCase();
    }

    return node.id;
  }, [node]);
}
