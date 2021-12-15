import React from 'react';

import { Button } from '@ofa/ui';

interface Props {
  className?: string;
  children?: React.ReactNode
}

function ButtonElem(props: Props): JSX.Element {
  const style: any = { ...props };
  console.log('style', props);
  return (
    <div>
      <Button >btn elem</Button>
    </div>
  );
}

export default ButtonElem;
