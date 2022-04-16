import React, { useState, useContext, useEffect } from 'react';
import { Artery } from '@one-for-all/artery';
import { findNodeByID, getNodeParentIDs } from '@one-for-all/artery-utils';

import { ShadowNode, VisibleNode } from '../types';
import { ArteryCtx } from '../contexts';
import RenderShadowNode from './render-shadow-node';
import { ShadowNodesContext } from './contexts';

interface Props {
  nodes: VisibleNode[];
  setActiveID: (id: string) => void;
}

function isNodeSupportChildren(id: string, artery: Artery): boolean {
  const node = findNodeByID(artery.node, id);
  if (!node) {
    return false;
  }

  // TODO fix this
  return 'name' in node && node.name === 'div';
}

function ShadowNodes({ nodes, setActiveID }: Props): JSX.Element {
  const { artery, activeNode } = useContext(ArteryCtx);
  const [shadowNodes, setShadowNodes] = useState<Array<ShadowNode>>([]);

  useEffect(() => {
    const _shadowNodes = nodes
      .map((node) => {
        const { id, absolutePosition } = node;
        const parentIDs = getNodeParentIDs(artery.node, id);
        if (!parentIDs) {
          return false;
        }

        const shadowNode: ShadowNode = {
          ...node,
          absolutePosition,
          nodePath: parentIDs,
          depth: parentIDs.length,
          area: node.rect.height * node.rect.width,
          supportChildren: isNodeSupportChildren(id, artery),
        };

        return shadowNode;
      })
      .filter((n): n is ShadowNode => !!n);

    setShadowNodes(_shadowNodes);
  }, [nodes]);

  return (
    <ShadowNodesContext.Provider value={shadowNodes}>
      <div className="shadow-nodes">
        {shadowNodes.map((shadowNode) => {
          return (
            <RenderShadowNode
              key={shadowNode.id}
              shadowNode={shadowNode}
              isActive={activeNode?.id === shadowNode.id}
              onClick={() => setActiveID(shadowNode.id)}
            />
          );
        })}
      </div>
    </ShadowNodesContext.Provider>
  );
}

export default ShadowNodes;
