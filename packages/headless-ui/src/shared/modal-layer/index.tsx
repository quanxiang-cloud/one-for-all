import React, { PropsWithChildren } from 'react';
import cs from 'classnames';

import { Portal } from '../portal';
import { uesHandleEsc, useToggleCallback } from './hooks';
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

  if (!isOpen) {
    return null;
  }

  if (container === 'inside') {
    return (
      <div className={cs('ofa-modal-layer', 'ofa-modal-layer--inside', className)} onClick={() => onClose?.()}>
        <div className="ofa-modal-layer__backdrop" />
        {children}
      </div>
    )
  }

  return (
    <Portal mountPoint={typeof container === 'function' ? container() : container}>
      <div className={cs('ofa-modal-layer', className)} onClick={() => onClose?.()} onScroll={(e) => e.stopPropagation()}>
        <div
          className="ofa-modal-layer__backdrop"
        />
        {children}
      </div>
    </Portal>
  );
}
