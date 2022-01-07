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
}

function Textarea(props: Props, ref: React.LegacyRef<HTMLDivElement>): JSX.Element {
  const { placeholder, cols, rows, minLength, maxLength, ...rest } = props;

  return (
    <div {...rest} ref={ref}>
      <textarea
        className="pl-5"
        placeholder={placeholder || '请输入内容'}
        cols={cols} rows={rows}
        defaultValue=''
        minLength={minLength}
        maxLength={maxLength}></textarea>
    </div>
  );
}

export default React.forwardRef(Textarea);
