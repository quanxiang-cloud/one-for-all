import React from 'react';

import { GridProps } from '../types';

const DefaultStyles: React.CSSProperties = {
  display: 'grid',
  columnGap: '16px',
  rowGap: '16px',
  gridTemplateColumns: 'repeat(12, 1fr)',
  placeItems: 'stretch',
  gridAutoRows: 'auto',
  gridArea: 'span 1 / span 1 / auto / auto',
};

function Grid(
  { className, style, children, colGap, rowGap, ...rest }: GridProps,
  ref: React.LegacyRef<HTMLDivElement>,
): JSX.Element {
  const dataNodeKey = rest['data-node-key'] || '';

  return (
    <div
      data-node-key={dataNodeKey}
      id={dataNodeKey}
      ref={ref}
      className={className}
      style={{ ...DefaultStyles, columnGap: colGap, rowGap, ...style }}
    >
      {children}
    </div>
  );
}

export default React.forwardRef(Grid);
