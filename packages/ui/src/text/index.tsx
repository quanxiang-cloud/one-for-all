import React from 'react';
import cs from 'classnames';

export interface Props {
  content: string,
  isAllowSelect: boolean,
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Text({ content, isAllowSelect, style, className, ...rest }: Props, ref: any): JSX.Element {
  return (
    <span
      {...rest}
      ref={ref}
      style={style}
      className={cs({
        'user-select': isAllowSelect ? 'none' : 'auto',
      }, className)}
    >
      {content || '文本'}
    </span>
  );
}

export default React.forwardRef(Text);
