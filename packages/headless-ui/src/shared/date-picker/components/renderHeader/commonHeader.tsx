import React from 'react';
import Icon from '@one-for-all/icon';

import { ArrowList } from './index';

type Props = {
  hiddenArrow?: boolean;
  children: React.ReactChild | React.ReactChild[];
  onSubtract?: () => void;
  onAdd?: () => void;
  onSuperSubtract?: () => void;
  onSupperAdd?: () => void;
}

export default function CommonHeader({
  nextIcon,
  prevIcon,
  superNextIcon,
  superPrevIcon,
  hiddenArrow = false,
  children,
  onSubtract,
  onAdd,
  onSuperSubtract,
  onSupperAdd,
}: Props & ArrowList): JSX.Element {
  return (
    <div className="ofa-date-picker-common-header">
      <span className="ofa-date-picker-icon-box" onClick={onSuperSubtract}>
        {superPrevIcon || <Icon name="arrow_left" size={20} />}
      </span>
      {!hiddenArrow && (
        <span className="ofa-date-picker-icon-box" onClick={onSubtract}>
          {prevIcon || <Icon name="keyboard_arrow_left" size={20} />}
        </span>
      )}
      <span className="ofa-date-picker-time">
        { children }
      </span>
      {!hiddenArrow && (
        <span className="ofa-date-picker-icon-box" onClick={onAdd}>
          {nextIcon || <Icon name="keyboard_arrow_right" size={20} />}
        </span>
      )}
      <span className="ofa-date-picker-icon-box" onClick={onSupperAdd}>
        {superNextIcon || <Icon name="arrow_right" size={20} />}
      </span>
    </div>
  );
}
