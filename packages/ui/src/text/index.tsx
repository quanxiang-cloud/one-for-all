import React from 'react';
import cs from 'classnames';

export interface Props {
  content: string,
  isAllowSelect: boolean,
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Text({ content, isAllowSelect, style, className }: Props): JSX.Element {
  return (
    <span
      style={style}
      className={cs({
        'user-select': isAllowSelect ? 'none' : 'auto',
      }, className)}
    >
      {content || '文本'}
    </span>
  );
}

export default Text;
