import React from 'react';
import cs from 'classnames';

import { TextareaProps } from '../types';

function Textarea(props: TextareaProps, ref: React.LegacyRef<HTMLTextAreaElement>): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  const { placeholder = '请输入内容', style, className, children, id, name, value, cols, rows,
    minLength, maxLength, onChange, onKeyDown, onFocus, onBlur, ...rest } = props;
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
    <textarea
      {...rest}
      {...normalizeProps}
      style={style}
      ref={ref}
      className={cs('pl-5 py-6 min-w-120 border border-gray-300 corner-2-8-8-8', className)}
      placeholder={placeholder}
      cols={cols}
      rows={rows}
      minLength={minLength}
      maxLength={maxLength}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

export default React.forwardRef(Textarea);
