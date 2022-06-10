import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';

import ModalLayer from '../shared/modal-layer';

const Meta: ComponentMeta<typeof ModalLayer> = {
  title: 'headless-ui/ModalLayer',
  component: ModalLayer,
};

export default Meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>click me to open modal</button>
      <ModalLayer isOpen={isOpen}>
        <h1>this is modal content</h1>
        <button onClick={() => setIsOpen(false)}>click me to close modal</button>
      </ModalLayer>
    </div>
  );
};

export const CallOnCloseWhenEscDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>click me to open modal</button>
      <ModalLayer callOnCloseWhenEscDown isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h1>this is modal content</h1>
        <button onClick={() => setIsOpen(false)}>click me to close modal</button>
      </ModalLayer>
    </div>
  );
};
