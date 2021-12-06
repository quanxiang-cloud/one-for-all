import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import './panel.scss';

interface Props {
  title?: string;
  width?: number | string;
  height?: number | string;
  pinnable?: boolean;
  closable?: boolean;
  visible?: boolean;
  pinned?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClose?: () => void;
  onPin?: () => void
}

function Panel({
  width = '268px',
  height = '100%',
  title = '',
  pinnable,
  closable,
  visible,
  pinned,
  className,
  style,
  children,
  onClose,
  onPin,
}: Props) {
  return (
    <div
      className={cs('panel px-8 py-16 overflow-auto z-10', { 'panel-closed': !visible }, className)}
      style={{
        width,
        height,
        ...style,
      }}
    >
      <div className='panel--header flex justify-between items-center pb-16'>
        <div className='panel--header-title'>{title}</div>
        <div className='panel--header-actions inline-flex items-center'>
          {pinnable && (
            <div className={cs('panel--header-actions-pin mr-8', { pinned })}>
              <Icon
                name='push_pin'
                clickable
                changeable
                onClick={onPin}
              />
            </div>
          )}
          {closable && (
            <div className='panel--header-actions-close'>
              <Icon
                name='close'
                clickable
                changeable
                onClick={onClose}
              />
            </div>
          )}
        </div>
      </div>
      <div className='panel--body'>
        {children}
      </div>
    </div>
  );
}

export default Panel;
