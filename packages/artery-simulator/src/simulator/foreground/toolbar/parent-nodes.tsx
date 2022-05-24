import React, { useEffect, useState } from 'react';
import { Node } from '@one-for-all/artery';
import { keyPathById, parentIdsSeq } from '@one-for-all/artery-utils';

import { artery$, immutableRoot$, setActiveNode } from '../../bridge';
import { useBehaviorSubjectState } from '../../utils';
import { hoveringParentID$ } from '../../atoms';

interface Props {
  currentNodeID: string;
  onParentClick: () => void;
}

function ParentNodes({ currentNodeID, onParentClick }: Props): JSX.Element | null {
  const artery = useBehaviorSubjectState(artery$);
  const [parents, setParents] = useState<Node[]>([]);

  useEffect(() => {
    const parentIDs = parentIdsSeq(immutableRoot$.value, currentNodeID);
    if (!parentIDs) {
      return;
    }

    // @ts-ignore
    const _parents: Node[] = parentIDs
      .map((parentID) => {
        const keyPath = keyPathById(immutableRoot$.value, parentID);
        if (!keyPath) {
          return;
        }
        return immutableRoot$.value.getIn(keyPath);
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
              hoveringParentID$.next(id);
            }}
            onMouseLeave={() => {
              hoveringParentID$.next('');
            }}
            onClick={(e) => {
              e.stopPropagation();
              hoveringParentID$.next('');
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
