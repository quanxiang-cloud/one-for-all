import React from 'react';
import cs from 'classnames';

export interface Props {
  content: string,
  isAllowSelect: boolean,
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Text({ content, isAllowSelect }: Props): JSX.Element {
  return (
    <span
      className={cs({
        'user-select': isAllowSelect ? 'none' : 'auto',
      })}
    >
      {content || '文本'}
    </span>
  );
}

export default Text;
