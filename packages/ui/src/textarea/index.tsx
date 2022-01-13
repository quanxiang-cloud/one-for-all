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
  'data-node-key'?: string;
}

function Textarea(props: Props, ref: React.LegacyRef<HTMLDivElement>): JSX.Element {
  const { placeholder, cols, rows, minLength, maxLength, style, ...rest } = props;

  const dataNodeKey = rest['data-node-key'] || '';

  return (
    <div data-node-key={dataNodeKey} style={style} ref={ref}>
      <textarea
        id={dataNodeKey}
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
