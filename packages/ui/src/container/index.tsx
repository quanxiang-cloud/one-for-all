import React, { Children } from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
  'data-node-key'?: string;
}

function Container(
  { className, style, children, placeholder, ...rest }: Props,
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
    >
      {children}
      {!Children.count(children) && placeholder}
    </div>
  );
}

export default React.forwardRef(Container);
