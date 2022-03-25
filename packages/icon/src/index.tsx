import React, { useEffect, useState } from 'react';
import svgSprite from './sprite.svg';
import getIconInSprite from './getIconInSprite';

export interface IconProps {
  name: string;
  className?: string;
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
  'data-node-key'?: string;
}

function Icon(
  { name, size = 16, color, className = '', style, ...rest }: IconProps,
  ref?: React.Ref<SVGSVGElement>,
): JSX.Element {
  const [icon, setIcon] = useState('');
  const _style: React.CSSProperties = {
    ...style,
    width: typeof size === 'string' ? size : `${size}px`,
    height: typeof size === 'string' ? size : `${size}px`,
    fill: color,
  };
  const dataNodeKey = rest['data-node-key'] || '';

  useEffect(() => {
    getIconInSprite.getIconById(svgSprite, name).then((icon) => {
      setIcon(icon.innerHTML);
    });
  }, [name]);

  return (
    <svg
      ref={ref}
      data-name={name}
      style={_style}
      className={'ofa-svg-icon ' + className}
      data-node-key={dataNodeKey}
    >
      {!!icon && (
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id={name}
          dangerouslySetInnerHTML={{ __html: icon }}
        ></symbol>
      )}
      <use xlinkHref={`#${name}`} />
    </svg>
  );
}

export default React.forwardRef(Icon);
