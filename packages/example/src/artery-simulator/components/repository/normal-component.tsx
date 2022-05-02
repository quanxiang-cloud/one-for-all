import React from 'react';

const style: React.CSSProperties = {
  height: '200px',
};

export default function Normal({ name }: { name: string; }): JSX.Element {
  return <div style={style}>This is just a normal component: {name}</div>;
}
