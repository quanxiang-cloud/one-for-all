import React from 'react';
import cs from 'classnames';

import styles from './index.m.scss';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Container(
  { className, style, children, ...rest }: Props,
  ref: React.LegacyRef<HTMLDivElement>,
): JSX.Element {
  return (
    <div
      {...rest}
      className={cs(styles.coll, className)}
      style={style}
      ref={ref}
    >
      {children || (
        <div className={styles.placeholder}>
          拖拽组件或模板到这里
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(Container);
