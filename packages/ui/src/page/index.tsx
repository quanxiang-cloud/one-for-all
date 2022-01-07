import React, { Children } from 'react';
import cs from 'classnames';

import styles from './index.m.scss';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: React.ReactNode;
}

function Page(
  { className, style, children, placeholder, ...rest }: Props,
  ref: React.LegacyRef<HTMLDivElement>,
): JSX.Element {
  return (
    <div
      {...rest}
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
