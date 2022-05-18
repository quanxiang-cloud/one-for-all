import React, { PropsWithChildren } from 'react';
import cs from 'classnames';

import { Portal } from '../portal';
import { uesHandleEsc, usePreventBodyScroll, useToggleCallback } from './hooks';

import './index.scss';

export type Props = PropsWithChildren<{
  isOpen: boolean;
  className?: string;
  onClose?: () => void;
  container?: 'inside' | HTMLElement | (() => HTMLElement);
  callOnCloseWhenEscDown?: boolean;
}>;

export default function ModalLayer({
  className,
  isOpen,
  onClose,
  container,
  callOnCloseWhenEscDown,
  children,
}: Props): JSX.Element | null {
  uesHandleEsc({ isOpen, onClose, callOnCloseWhenEscDown });
  useToggleCallback({ isOpen, onClose });
  usePreventBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  if (container === 'inside') {
    return (
      <div className={cs('ofa-modal-layer', 'ofa-modal-layer--inside', className)}>
        <div className="ofa-modal-layer__backdrop" onClick={() => onClose?.()} />
        {children}
      </div>
    );
  }

  return (
    <Portal mountPoint={typeof container === 'function' ? container() : container}>
      <div className={cs('ofa-modal-layer', className)}>
        <div className="ofa-modal-layer__backdrop" onClick={() => onClose?.()} />
        {children}
      </div>
    </Portal>
  );
}
