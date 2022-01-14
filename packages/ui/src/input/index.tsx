import React from 'react';
import cs from 'classnames';

import { InputProps } from '../types';

function Input(props: InputProps, ref: React.LegacyRef<HTMLInputElement>): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  const { placeholder, type, style, className, children, id, name, value, ...rest } = props;
  const normalizeProps = {};
  if (id) {
    Object.assign(normalizeProps, { id });
  }
  if (name) {
    Object.assign(normalizeProps, { name });
  }
  if (value) {
    Object.assign(normalizeProps, { value });
  }

  return (
    <input
      {...rest}
      {...normalizeProps}
      style={style}
      className={cs('py-6 min-w-120 border border-gray-300 corner-2-8-8-8', className)}
      ref={ref}
      type={type}
      placeholder={placeholder}
    />
  );
}
export default React.forwardRef(Input);
