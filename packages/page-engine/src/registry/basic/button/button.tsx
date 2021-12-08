import React from 'react';

import { Button } from '@ofa/ui';

interface Props {
  className?: string;
  children?: React.ReactNode
}

function ButtonElem(props: Props) {
  return (
    <div>
      <Button>btn elem</Button>
    </div>
  );
}

export default ButtonElem;
