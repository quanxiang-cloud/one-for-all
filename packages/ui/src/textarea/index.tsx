import React from 'react';

export interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
  cols?: number;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
}

function Textarea(props: Props, ref: React.LegacyRef<HTMLDivElement>): JSX.Element {
  const { placeholder, cols, rows, minLength, maxLength, required, ...rest } = props;

  return (
    <div {...rest} ref={ref}>
      <textarea
        placeholder={placeholder || '请输入内容'}
        cols={cols}
        rows={rows}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
      ></textarea>
    </div>
  );
}

export default React.forwardRef(Textarea);
