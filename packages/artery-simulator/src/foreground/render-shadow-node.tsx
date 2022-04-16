import React, { useContext } from 'react';
import cs from 'classnames';

import { Position, ShadowNode } from '../types';
import { ArteryCtx, IndicatorCTX } from '../contexts';
import { debounce } from '../utils';
import calcGreenZone from './calc-green-zone';
import { ShadowNodesContext } from './contexts';
import useShadowNodeStyle from './use-shadow-node-style';

function preventDefault(e: any): false {
  e.preventDefault();
  return false;
}

function handleMove(nodeID: string, targetID: string, position: Position): void {

}

interface Props {
  shadowNode: ShadowNode;
  onClick: () => void;
  isActive: boolean;
  className?: string;
}

function RenderShadowNode({
  shadowNode,
  onClick,
  isActive,
  className,
  // onDrop,
}: Props): JSX.Element {
  const { id } = shadowNode;
  const { rootNodeID } = useContext(ArteryCtx);
  const style = useShadowNodeStyle(shadowNode);
  const shadowNodes = useContext(ShadowNodesContext);
  const { setGreenZone, greenZone, setShowIndicator } = useContext(IndicatorCTX);

  const handleDrag = debounce((e) => {
    const greenZone = calcGreenZone({ x: e.clientX, y: e.clientY, nodeID: id }, shadowNodes);
    setGreenZone(greenZone);
  });

  function handleDrop(e: React.UIEvent): boolean {
    e.preventDefault();
    e.stopPropagation();
    if (!greenZone) {
      return false;
    }

    handleMove(shadowNode.id, greenZone.hoveringNodeID, greenZone.position);

    // reset green zone to undefine to prevent green zone first paine flash
    setGreenZone(undefined);
    return false;
  }

  return (
    <div
      draggable={id !== rootNodeID}
      onDragStart={() => setShowIndicator(true)}
      onDragEnd={() => setShowIndicator(false)}
      onDrag={handleDrag}
      onDragOver={preventDefault}
      onDragEnter={preventDefault}
      onDrop={handleDrop}
      key={id}
      style={style}
      onClick={onClick}
      className={cs('shadow-node', className, {
        'shadow-node--root': rootNodeID === id,
        'shadow-node--active': isActive,
      })}
    >
      {/* {id} */}
    </div>
  );
}

export default RenderShadowNode;
