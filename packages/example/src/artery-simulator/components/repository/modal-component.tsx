import React, { useState } from 'react';
import { MediocreDialog } from '@one-for-all/headless-ui';

const style: React.CSSProperties = {
  height: '200px',
};

interface Props {
  isOpen: boolean;
}

export default function Modal({ isOpen }: Props): JSX.Element {
  return (
    <MediocreDialog isShow={isOpen}>
      <div style={style}>this is modal component</div>
    </MediocreDialog>
  );
}
