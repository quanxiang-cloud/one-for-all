import React from 'react';

export interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
  cols?: number;
  rows?: number;
  minlength?: number;
  maxlength?: number;
  required?: boolean;
}

function Textarea(props: Props): JSX.Element {
  const { placeholder, cols, rows, minlength, maxlength, required } = props;

  return (
    <div>
      <textarea
        placeholder={placeholder || '请输入内容'}
        cols={cols}
        rows={rows}
        minLength={minlength}
        maxLength={maxlength}
        required={required}
      ></textarea>
    </div>
  );
}

export default Textarea;
