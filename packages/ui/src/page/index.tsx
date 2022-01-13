import React, { Children } from 'react';
import cs from 'classnames';

import styles from './index.m.scss';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
  'data-node-key'?: string;
}

function Page(
  { className, style, children, placeholder, ...rest }: Props,
  ref: React.LegacyRef<HTMLDivElement>,
): JSX.Element {
  const dataNodeKey = rest['data-node-key'] || '';

  return (
    <div
      data-node-key={dataNodeKey}
      id={dataNodeKey}
      ref={ref}
      className={cs(styles.page, className)}
      style={style}
    >
      {children}
      {!Children.count(children) && placeholder}
    </div>
  );
}

export default React.forwardRef(Page);
