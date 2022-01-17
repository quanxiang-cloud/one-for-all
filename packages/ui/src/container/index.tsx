import React, { Children } from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
  'data-node-key'?: string;
  onClick?: () => void;
}

function Container(
  { className, style, children, placeholder, onClick, ...rest }: Props,
  ref: React.LegacyRef<HTMLDivElement>,
): JSX.Element {
  const dataNodeKey = rest['data-node-key'];

  return (
    <div
      data-node-key={dataNodeKey}
      ref={ref}
      id={dataNodeKey}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
      {!Children.count(children) && placeholder}
    </div>
  );
}

export default React.forwardRef(Container);
