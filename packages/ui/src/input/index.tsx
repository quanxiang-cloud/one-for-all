import React from 'react';

import { InputProps } from '../types';

function Input(props: InputProps): JSX.Element {
  const { placeholder, type } = props;
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
      ></input>
    </div>
  );
}
export default Input;
