import React from 'react';
import cs from 'classnames';

export interface Props {
  id?: string;
  content?: string,
  isAllowSelect?: boolean,
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  'data-node-key'?: string;
  onClick?: () => void;
}

function Text(
  { id, content, isAllowSelect, style, className, onClick, ...rest }: Props,
  ref: React.LegacyRef<HTMLSpanElement>,
): JSX.Element {
  const dataNodeKey = rest['data-node-key'];

  return (
    <span
      data-node-key={dataNodeKey}
      ref={ref}
      id={id}
      style={style}
      className={cs({
        'user-select': isAllowSelect ? 'none' : 'auto',
      }, className)}
      onClick={onClick}
    >
      {content}
    </span>
  );
}

export default React.forwardRef(Text);
