import React, { ForwardedRef, forwardRef, CSSProperties } from 'react';
import cs from 'classnames';

function Divider(props: DividerProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
  const { className, size = '100%', direction = 'horizontal', thickness = '1px', style = {} } = props;
  const _style: CSSProperties = {};

  if (direction === 'horizontal') {
    _style.height = thickness;
    _style.width = size;
  } else {
    _style.width = thickness;
    _style.height = size;
  }

  return <div ref={ref} style={{ ..._style, ...style }} className={cs('ofa-divider', className)} />;
}

export default forwardRef(Divider);
