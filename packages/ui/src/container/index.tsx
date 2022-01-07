import React, { Children } from 'react';
import cs from 'classnames';

import styles from './index.m.scss';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
}

function Container({ className, style, children, placeholder }: Props): JSX.Element {
  return (
    <div
      className={cs(styles.coll, className)}
      style={style}
    >
      {children}
      {!Children.count(children) && placeholder}
    </div>
  );
}

export default Container;
