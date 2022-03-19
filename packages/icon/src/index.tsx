import React from 'react';

import svgSprite from './sprite.svg';

interface IconProps {
  name: string;
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
}

function Icon(
  { name, size = 16, className = '', style }: IconProps,
  ref?: React.Ref<SVGSVGElement>,
): JSX.Element {
  const _style: React.CSSProperties = {
    ...style,
    width: typeof size === 'string' ? size : `${size}px`,
    height: typeof size === 'string' ? size : `${size}px`,
  };


  return (
    <svg ref={ref} data-name={name} style={_style} className={'ofa-svg-icon ' + className}>
      <use xlinkHref={`${svgSprite}#${name}`} />
    </svg>
  );
}

export default React.forwardRef(Icon);
