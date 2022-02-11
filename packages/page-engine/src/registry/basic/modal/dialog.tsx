import React, { useState, Children } from 'react';
import {noop} from 'lodash'

import { Modal } from '@one-for-all/ui'
import {Props as ConfigProps} from './config-form';

function Dialog({children, hideFooter, okIconName, okText, cancelIconName, cancelText, ...rest}: ConfigProps) {
  return (
    <Modal
      controlled
      wrapStyle={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
      footerBtns={hideFooter ? [] : [
        {
          key: 'close',
          iconName: cancelIconName,
          onClick: noop,
          text: cancelText,
        },
        {
          key: 'check',
          iconName: okIconName,
          modifier: 'primary',
          onClick: noop,
          text: okText,
        },
      ]}
      {...rest}
    >
      {children}
    </Modal>
  );
}

export default Dialog;
