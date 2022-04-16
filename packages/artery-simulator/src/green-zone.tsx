import React, { useContext } from 'react';
import cs from 'classnames';
import { ArteryCtx } from './contexts';

import { GreenZone } from './types';
import useShadowNodeStyle from './foreground/use-shadow-node-style';

interface Props {
  greenZone: GreenZone;
}

function RenderGreenZone({ greenZone }: Props): JSX.Element {
  const style = useShadowNodeStyle(greenZone.mostInnerNode);
  const { rootNodeID } = useContext(ArteryCtx);

  return (
    <div
      style={style}
      className={cs('green-zone-indicator', `green-zone-indicator--${greenZone.position}`, {
        'green-zone-indicator--root': rootNodeID === greenZone.hoveringNodeID,
      })}
    />
  );
}

export default RenderGreenZone;
