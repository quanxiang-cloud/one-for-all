import React, { useRef } from 'react';
import { usePopper } from '@one-for-all/headless-ui';
import { deleteByID, insertAfter } from '@one-for-all/artery-utils';

import ParentNodes from './parent-nodes';
import Icon from '@one-for-all/icon';
import { useNodeLabel } from './use-node-label';
import { onChangeArtery, setActiveNode } from '../../bridge';
import {
  activeContour$,
  activeContourToolbarStyle$,
  activeNode$,
  artery$,
  useArteryRootNodeID,
} from '../../states-center';
import { duplicateNode, useBehaviorSubjectState } from '../../utils';

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

// render toolbar on another context to prevent it be covered by contour node
function ContourNodeToolbar(): JSX.Element | null {
  const activeNode = useBehaviorSubjectState(activeNode$);
  const activeContour = useBehaviorSubjectState(activeContour$);
  const { referenceRef, Popper, handleMouseEnter, handleMouseLeave, close } = usePopper<HTMLSpanElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const style = useBehaviorSubjectState(activeContourToolbarStyle$);
  const activeNodeLabel = useNodeLabel(activeNode);
  const rootNodeID = useArteryRootNodeID();

  function handleDelete(): void {
    if (!activeContour$.value) {
      return;
    }

    const newRoot = deleteByID(artery$.value.node, activeContour$.value.id);
    onChangeArtery({ ...artery$.value, node: newRoot });
    setActiveNode(undefined);
  }

  function handleDuplicate(): void {
    if (!activeNode) {
      return;
    }

    const newNode = duplicateNode(activeNode);
    const newRoot = insertAfter(artery$.value.node, activeNode.id, newNode);
    if (!newRoot) {
      return;
    }
    onChangeArtery({ ...artery$.value, node: newRoot });
    // this really annoying if changed the active node, so comment below line
    // setActiveNode(newNode);
  }

  if (!activeContour || activeContour.id === rootNodeID) {
    return null;
  }

  return (
    <div ref={containerRef} className="active-contour-node-toolbar" style={style}>
      <span
        ref={referenceRef}
        className="active-contour-node-toolbar__parents"
        // onClick={handleClick()}
        onMouseEnter={handleMouseEnter()}
        onMouseLeave={handleMouseLeave()}
      >
        {activeNodeLabel}
      </span>
      <span onClick={handleDuplicate} className="active-contour-node-toolbar__action" title="复制">
        <Icon name="content_copy" size={16} />
      </span>
      <span onClick={handleDelete} className="active-contour-node-toolbar__action" title="删除">
        <Icon name="delete_forever" size={16} />
      </span>
      <Popper placement="bottom-start" modifiers={modifiers} container={containerRef.current}>
        <ParentNodes currentNodeID={activeContour.id} onParentClick={close} />
      </Popper>
    </div>
  );
}

export default ContourNodeToolbar;
