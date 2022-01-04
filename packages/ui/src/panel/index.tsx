import React from 'react';
import cs from 'classnames';

import Icon from '../icon';

import styles from './panel.m.scss';

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
}: Props): JSX.Element {
  return (
    <div
      className={cs('overflow-y-auto z-10', {
        [styles.closed]: !visible,
        [styles.panelPinned]: pinned,
      }, styles.panel, className)}
      style={{
        width,
        height,
        ...style,
      }}
    >
      <div className={cs('flex justify-between items-center px-8 py-8 bg-white w-full', styles.header)}>
        <div className={styles.title}>{title}</div>
        <div className={cs('inline-flex items-center', styles.actions)}>
          {pinnable && (
            <div className={cs(styles.actionPin, { [styles.pinned]: pinned })}>
              <Icon
                name='push_pin'
                clickable
                changeable
                onClick={onPin}
              />
            </div>
          )}
          {closable && (
            <div className={styles.actionClose}>
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
      <div className={cs('px-8 py-8 overflow-auto', styles.body)}>
        {children}
      </div>
    </div>
  );
}

export default Panel;
