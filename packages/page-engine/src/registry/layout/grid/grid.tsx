import React from 'react';
import cs from 'classnames';

import styles from './index.m.scss';

export interface Props {
  colRatio: string; // 列比例
  colGap: string; // 列间距
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Grid({ className, style, colRatio, colGap, children }: Props) {
  return (
    <div
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

export default Grid;
