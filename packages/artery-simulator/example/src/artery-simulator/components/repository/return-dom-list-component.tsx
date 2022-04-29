import React from 'react';

const style: React.CSSProperties = {
  height: '20px',
};

export default function ReturnDomList(): JSX.Element {
  return (
    <>
      <div style={style}>dom list item 1</div>
      <div>dom list item 2</div>
      <div>dom list item 3</div>
      <div>dom list item 4</div>
    </>
  );
}
