import React from 'react';
import cs from 'classnames';

import svgHash from './svg-hash';

interface IconProps {
  name: string;
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
}

function Icon(
  {
    name,
    size = 16,
    className,
    style,
  }: IconProps,
  ref?: React.Ref<SVGSVGElement>,
): JSX.Element {
  const _style: React.CSSProperties = {
    ...style,
    width: typeof size === 'string' ? size : `${size}px`,
    height: typeof size === 'string' ? size : `${size}px`,
  };

  return (
    <svg
      ref={ref}
      data-name={name}
      style={_style}
      className={cs('ofa-svg-icon', className)}
    >
      <use xlinkHref={`${svgHash}#${name}`} />
    </svg>
  );
}

export default React.forwardRef(Icon);
