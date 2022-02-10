import React, { useLayoutEffect, useState, Children } from 'react';
import { Modal } from '@one-for-all/ui'

interface Props {
  className?: string;
  placeholder?: React.ReactNode;
  children?: React.ReactNode;
}

function Dialog({children, placeholder, ...rest}: Props) {
  // todo: move isOpen to upper state, or controlled by config form
  const [isOpen, setOpen]=useState(true)

  return (
    <Modal
      controlled
      isOpen={isOpen}
      wrapStyle={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
      onClose={()=> setOpen(false)}
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: () => {
            console.log('on cancel modal')
          },
          text: '取消',
        },
        {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: ()=>{
            console.log('on submit modal')
          },
          text: '确定',
        },
      ]}
      {...rest}
    >
      {placeholder || children}
    </Modal>
  );
}

export default Dialog;
