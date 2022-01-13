import React from 'react';

import { InputProps } from '../types';

function Input(props: InputProps, ref: React.LegacyRef<HTMLDivElement>): JSX.Element {
  const { placeholder, type, style, ...rest } = props;

  const dataNodeKey = rest['data-node-key'] || '';

  return (
    <div data-node-key={dataNodeKey} style={style} ref={ref}>
      <input
        id={dataNodeKey}
        type={type}
        placeholder={placeholder}
      ></input>
    </div>
  );
}
export default React.forwardRef(Input);
