import React, { useContext, useMemo } from 'react';
import cs from 'classnames';
import { ArteryCtx } from './contexts';

import { draggingNodeIDState, greenZoneState } from './atoms';
import { useRecoilState } from 'recoil';
import { Rect } from '@one-for-all/elements-radar';

function getStyle(rect?: Rect): React.CSSProperties | undefined {
  if (!rect) {
    return;
  }

  const { height, width, x, y } = rect;
  return {
    // zIndex: depth,
    height: height,
    width: width,
    transform: `translate(${x}px, ${y}px)`,
  };
}

function useIndicatorStyle(): React.CSSProperties | undefined {
  const [greenZone] = useRecoilState(greenZoneState);
  return useMemo(() => {
    if (!greenZone) {
      return;
    }

    const { position, mostInnerNode } = greenZone;
    const { height, width, x, y } = mostInnerNode.absolutePosition;
    const _height = height - 4;
    const _y = y + 2;

    if (position === 'inner') {
      return {
        height: _height,
        width: width,
        transform: `translate(${x}px, ${_y}px)`,
      };
    }

    if (position === 'inner-left') {
      return {
        height: _height,
        width: '8px',
        transform: `translate(${x + 1}px, ${_y}px)`,
      };
    }

    if (position === 'inner-right') {
      return {
        height: _height,
        width: '8px',
        transform: `translate(${x + width - 9}px, ${_y}px)`,
      };
    }

    if (position === 'left') {
      return {
        height: _height,
        width: '8px',
        transform: `translate(${x - 9}px, ${_y}px)`,
      };
    }

    if (position === 'right') {
      return {
        height: _height,
        width: '8px',
        transform: `translate(${x + width + 2}px, ${_y}px)`,
      };
    }

    return;
  }, [greenZone]);
}

function RenderGreenZone(): JSX.Element | null {
  const [greenZone] = useRecoilState(greenZoneState);
  const [draggingNodeID] = useRecoilState(draggingNodeIDState);
  const { rootNodeID } = useContext(ArteryCtx);
  const indicatorStyle = useIndicatorStyle();

  if (!draggingNodeID || !greenZone) {
    return null;
  }

  // `contour-green-zone--${greenZone.position}`
  return (
    <>
      <div
        style={getStyle(greenZone.mostInnerNode.absolutePosition)}
        className={cs('contour-green-zone', {
          'contour-green-zone--root': rootNodeID === greenZone.hoveringNodeID,
        })}
      />
      <div style={indicatorStyle} className="green-zone-position-indicator"/>
    </>
  );
}

export default RenderGreenZone;
