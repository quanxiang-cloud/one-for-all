import React, { PropsWithChildren } from 'react';
import Button from '../../shared/button';
import ModalLayer from '../../shared/modal-layer';

import './index.scss';

type Props = PropsWithChildren<{
  isShow: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  cancelBtnText?: string;
  okBtnText?: string;
  title?: string;
}>;

export default function MediocreDialog({
  children,
  isShow,
  onOk,
  onCancel,
  title,
  okBtnText = '确定',
  cancelBtnText = '取消',
}: Props): JSX.Element {
  return (
    <ModalLayer isOpen={isShow}>
      <div className="ofa-mediocre-dialog">
        {title && <div className="ofa-mediocre-dialog__title">{title}</div>}
        <div className="ofa-mediocre-dialog__body">{children}</div>
        <div className="ofa-mediocre-dialog__footer">
          <Button onClick={onCancel}>{cancelBtnText}</Button>
          <Button onClick={onOk} modifier="primary">
            {okBtnText}
          </Button>
        </div>
      </div>
    </ModalLayer>
  );
}
