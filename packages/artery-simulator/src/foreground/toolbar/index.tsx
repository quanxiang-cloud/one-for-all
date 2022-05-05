import React, { useContext, useRef } from 'react';
import { usePopper } from '@one-for-all/headless-ui';
import { deleteByID, insertAfter } from '@one-for-all/artery-utils';

import { ArteryCtx } from '../../contexts';
import ParentNodes from './parent-nodes';
import Icon from '@one-for-all/icon';
import duplicateNode from './duplicate-node';
import useToolbarStyle from './use-toolbar-style';
import { useNodeLabel } from './use-node-label';
import { useActiveContour } from './use-active-contour';

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
  const contourNode = useActiveContour();
  const { activeNode } = useContext(ArteryCtx);
  const { referenceRef, Popper, handleMouseEnter, handleMouseLeave, close } = usePopper<HTMLSpanElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { artery, setActiveNode, onChange, genNodeID } = useContext(ArteryCtx);
  const style = useToolbarStyle(contourNode);
  const activeNodeLabel = useNodeLabel(activeNode);

  function handleDelete(): void {
    if (!contourNode) {
      return;
    }

    const newRoot = deleteByID(artery.node, contourNode.id);
    onChange({ ...artery, node: newRoot });
    setActiveNode(undefined);
  }

  function handleDuplicate(): void {
    if (!activeNode) {
      return;
    }

    const newNode = duplicateNode(activeNode, genNodeID);
    const newRoot = insertAfter(artery.node, activeNode.id, newNode);
    if (!newRoot) {
      return;
    }
    onChange({ ...artery, node: newRoot });
    // this really annoying if changed the active node, so comment below line
    // setActiveNode(newNode);
  }

  if (!activeNode || !contourNode || activeNode.id === artery.node.id) {
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
        <ParentNodes currentNodeID={contourNode.id} onParentClick={close} />
      </Popper>
    </div>
  );
}

export default ContourNodeToolbar;
