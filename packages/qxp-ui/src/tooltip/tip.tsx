import React from 'react';
import cs from 'classnames';

import { Props } from './index';

import './style.scss';

export default function({
  className,
  style,
  label,
  labelClassName,
}: Omit<Props, 'position'>): JSX.Element {
  return (
    <div
      style={style}
      className={cs('qxp-ui-tooltip bg-gray-700 cursor-default', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='qxp-tooltip-arrow' data-popper-arrow />
      <div className={cs('qxp-ui-tooltip-label', labelClassName)}>{label}</div>
    </div>
  );
}
