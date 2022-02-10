import React from 'react';

type Callback=(...args: any[])=> void;

interface Props {
  id: string;
  title: string;
  isOpen: boolean;
  onClose?: Callback;
  onOpen?: Callback;
  onCancel?: Callback;
  onSubmit?: Callback;
  className?: string;
}

function ConfigForm(props: Props) {
  return (
    <div>
      modal config
    </div>
  );
}

export default ConfigForm;
