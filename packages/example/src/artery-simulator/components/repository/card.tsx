import React from 'react';

const style: React.CSSProperties = {
  display: 'inline-block',
  height: '100px',
  width: '200px',
  border: '1px solid grey',
  margin: '8px',
}

export default function Card(): JSX.Element {
  return (
    <div style={style}>simply card</div>
  )
}
