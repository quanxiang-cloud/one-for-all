import React from 'react';
import cs from 'classnames';

import { GridProps } from '../types';

import styles from './index.m.scss';

function Grid({ className, style, colRatio, colGap, children }: GridProps, ref: any): JSX.Element {
  return (
    <div
      ref={ref}
      className={cs(styles.gridElem, className)}
      style={{
        ...style,
        gridTemplateColumns: colRatio?.split(':').map((v) => `${v}fr`).join(' '),
        gridColumnGap: colGap,
      }}
    >
      {children}
    </div>
  );
}

export default React.forwardRef(Grid);
