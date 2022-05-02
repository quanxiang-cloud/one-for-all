import React from 'react';

const style: React.CSSProperties = {
  display: 'inline-block',
  // height: '10px',
  // width: '20px',
  border: '1px solid grey',
  margin: '8px',
};

export default function Card({ id }: { id: string }): JSX.Element {
  return <div style={style}>{id}</div>;
}
