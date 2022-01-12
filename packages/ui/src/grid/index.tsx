import React from 'react';

import { GridProps } from '../types';

const DefaultStyles: React.CSSProperties = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(12, 1fr)',
  placeItems: 'stretch',
  gridAutoRows: 'auto',
  gridArea: 'span 1 / span 1 / auto / auto',
};

function Grid(
  { className, style, children, ...rest }: GridProps,
  ref: React.LegacyRef<HTMLDivElement>,
): JSX.Element {
  return (
    <div
      data-node-key={rest['data-node-key']}
      ref={ref}
      className={className}
      style={{ ...DefaultStyles, ...style }}
    >
      {children}
    </div>
  );
}

export default React.forwardRef(Grid);
