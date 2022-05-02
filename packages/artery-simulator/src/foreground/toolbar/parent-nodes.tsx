import { Node } from '@one-for-all/artery';
import { keyPathById, parentIdsSeq } from '@one-for-all/artery-utils';
import React, { useContext, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { hoveringParentIDState, immutableNodeState } from '../../atoms';
import { ArteryCtx } from '../../contexts';

interface Props {
  currentNodeID: string;
  onParentClick: () => void;
}

function ParentNodes({ currentNodeID, onParentClick }: Props): JSX.Element | null {
  const { artery, setActiveNode } = useContext(ArteryCtx);
  const [immutableNode] = useRecoilState(immutableNodeState);
  const [parents, setParents] = useState<Node[]>([]);
  const setHoveringParentID = useSetRecoilState(hoveringParentIDState);

  useEffect(() => {
    const parentIDs = parentIdsSeq(immutableNode, currentNodeID);
    if (!parentIDs) {
      return;
    }

    // @ts-ignore
    const _parents: Node[] = parentIDs
      .map((parentID) => {
        const keyPath = keyPathById(immutableNode, parentID);
        if (!keyPath) {
          return;
        }
        return immutableNode.getIn(keyPath);
      })
      .filter((parentNode) => {
        if (!parentNode) {
          return false;
        }

        // @ts-ignore
        const parentNodeType = parentNode.getIn(['type']);
        return parentNodeType === 'html-element' || parentNodeType === 'react-component';
      })
      .toJS();
    // just show the max 5 level parent
    setParents(_parents?.reverse().slice(0, 5) || []);
  }, [artery]);

  if (!parents.length) {
    return null;
  }

  return (
    <div className="active-node-parents">
      {parents.map((parent) => {
        const { id, label } = parent;
        return (
          <span
            key={id}
            className="active-node-parents__parent"
            onMouseEnter={() => {
              setHoveringParentID(id);
            }}
            onMouseLeave={() => {
              setHoveringParentID('');
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHoveringParentID('');
              setActiveNode(parent);
              onParentClick();
            }}
          >
            {/* todo optimize this value */}
            {label || id}
          </span>
        );
      })}
    </div>
  );
}

export default ParentNodes;
