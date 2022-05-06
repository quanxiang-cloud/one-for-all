import React, { PropsWithChildren } from 'react';
import cs from 'classnames';

import { Portal } from '../portal';
import { uesHandleEsc, useToggleCallback } from './hooks';
import './index.scss';

type Props = PropsWithChildren<{
  isOpen: boolean;
  className?: string;
  onClose?: () => void;
  container?: HTMLElement | (() => HTMLElement);
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

  return (
    <Portal mountPoint={typeof container === 'function' ? container() : container}>
      <div className={cs('ofa-modal-layer', className)} onClick={() => onClose?.()}>
        {children}
      </div>
    </Portal>
  );
}
