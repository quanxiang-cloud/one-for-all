import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';

import MediocreDialog from '../web/mediocre-dialog';

const Meta: ComponentMeta<typeof MediocreDialog> = {
  title: 'headless-ui/MediocreDialog',
  component: MediocreDialog,
};

export default Meta;

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>click me to open the Mediocre Dialog</button>
      <MediocreDialog
        isShow={isOpen}
        title="this is dialog title"
        onCancel={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
      >
        <h1>some thing in the dialog body</h1>
      </MediocreDialog>
    </div>
  );
};
