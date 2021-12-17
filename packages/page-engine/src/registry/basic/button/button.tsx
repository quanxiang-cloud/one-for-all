import React from 'react';

import { Button } from '@ofa/ui';

interface Props {
  className?: string;
  children?: React.ReactNode
}

function ButtonElem(props: Props): JSX.Element {
  const style: any = { ...props.style };
  console.log('style', props);
  return (
    <div>
      <Button
        style={{ ...style }}
        // style={{ color: 'rgb(195, 45, 45)' }}
      >btn elem</Button>
    </div>
  );
}

export default ButtonElem;
