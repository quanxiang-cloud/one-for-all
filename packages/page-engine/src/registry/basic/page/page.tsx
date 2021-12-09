import React from 'react';
import cs from 'classnames';

import styles from './index.m.scss';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Page({ className, style, children }: Props) {
  return (
    <div className={cs(styles.page, className)} style={style}>
      {children}
    </div>
  );
}

export default Page;
