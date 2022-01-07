import React from 'react';

import { InputProps } from '../types';

function Input(props: InputProps, ref: React.LegacyRef<HTMLDivElement>): JSX.Element {
  const { placeholder, type, ...rest } = props;
  return (
    <div {...rest} ref={ref}>
      <input
        type={type}
        placeholder={placeholder}
      ></input>
    </div>
  );
}
export default React.forwardRef(Input);
