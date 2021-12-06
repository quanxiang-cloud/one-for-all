import React from 'react';
import ReactDOM from 'react-dom';

import Modal from './index';

interface Params {
  title: string;
  content: React.ReactNode | string;
  confirmText?: string;
  cancelText?: string;
  confirmModifier?: 'primary' | 'danger';
  cancelModifier?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function creatModal({
  title,
  content,
  confirmText = '确定',
  cancelText = '取消',
  confirmModifier = 'primary',
  cancelModifier,
  onConfirm,
  onCancel,
}: Params) {
  const modalDom = document.createElement('div');

  const close = () => {
    ReactDOM.unmountComponentAtNode(modalDom);
    modalDom.remove();
    onCancel && onCancel();
  };

  ReactDOM.render((
    <Modal
      title={title}
      onClose={close}
      footerBtns={[
        {
          text: cancelText,
          key: 'cancel',
          onClick: close,
          modifier: cancelModifier,
        },
        {
          text: confirmText,
          key: 'confirm',
          onClick: onConfirm,
          modifier: confirmModifier,
        },
      ]}
    >
      {typeof content === 'string' ? <p className='p-20'>{content}</p> : content}
    </Modal>
  ), modalDom);
  return { close };
}
