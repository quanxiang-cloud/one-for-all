import { useRecoilState } from 'recoil';
import { useState, useEffect, useMemo } from 'react';
import { keyPathById } from '@one-for-all/artery-utils';
import { ContourNode, VisibleNode } from '../types';
import { immutableNodeState } from '../atoms';

export function useContourNodes(nodes: VisibleNode[], isScrolling: boolean): Array<ContourNode> {
  const [immutableNode] = useRecoilState(immutableNodeState);
  const [contourNodes, setContourNodes] = useState<Array<ContourNode>>([]);
  const nodeDepthCache = useMemo(() => {
    return new Map<string, number>();
  }, [immutableNode]);

  useEffect(() => {
    if (isScrolling) {
      return;
    }

    const _contourNodes = nodes
      .map((node) => {
        // todo performance issue
        if (!nodeDepthCache.has(node.id)) {
          const keyPath = keyPathById(immutableNode, node.id);
          nodeDepthCache.set(node.id, keyPath?.size || 0);
        }

        const depth = nodeDepthCache.get(node.id) || 0;

        const contour: ContourNode = {
          ...node,
          // depth: parentIDs.length,
          depth: depth,
          area: node.relativeRect.height * node.relativeRect.width,
        };

        return contour;
      })
      .filter((n): n is ContourNode => !!n);

    setContourNodes(_contourNodes);
  }, [nodes, isScrolling]);

  return contourNodes;
}
