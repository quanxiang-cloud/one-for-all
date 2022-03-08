import React from 'react';

// @ts-ignore
const spriteURL = window.__svg_icon_sprite_url__;
if (!spriteURL) {
  console.error('you must set window.__svg_icon_sprite_url__ is in order to use "@one-for-all/icon"');
}

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
      <use xlinkHref={`${spriteURL}#${name}`} />
    </svg>
  );
}

export default React.forwardRef(Icon);
