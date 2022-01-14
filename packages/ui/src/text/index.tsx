import React from 'react';
import cs from 'classnames';

export interface Props {
  content: string,
  isAllowSelect: boolean,
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  'data-node-key'?: string;
}

function Text({ content = '文本', isAllowSelect, style, className, ...rest }: Props, ref: any): JSX.Element {
  const dataNodeKey = rest['data-node-key'];

  return (
    <span
      data-node-key={dataNodeKey}
      ref={ref}
      id={dataNodeKey}
      style={style}
      className={cs({
        'user-select': isAllowSelect ? 'none' : 'auto',
      }, className)}
    >
      {content}
    </span>
  );
}

export default React.forwardRef(Text);
