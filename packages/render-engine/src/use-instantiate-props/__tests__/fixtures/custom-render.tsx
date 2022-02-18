import React from 'react';

interface Props {
  itemRender: () => JSX.Element;
}

export default function CustomRender({ itemRender }: Props): JSX.Element {
  return <div id="custom-render">{itemRender()}</div>;
}
