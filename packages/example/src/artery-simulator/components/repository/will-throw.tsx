import React, { useEffect, useState } from 'react';

const style: React.CSSProperties = {
  height: '200px',
};

const zero = 0;

export default function WillThrow({ name }: { name: string; }): JSX.Element {
  const [state, setState] = useState('');
  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      setState(new Error('catch me if you can!'));
    }, 1000);
  }, [])
  return <div style={style}>This is just a normal component: {state}</div>;
}
