import React, { useEffect, useState } from 'react';
import svgSprite from './sprite.svg';
import getIconInSprite from './getIconInSprite';

export interface IconProps {
  name: string;
  className?: string;
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
}

function Icon(
  { name, size = 16, color, className = '', style }: IconProps,
  ref?: React.Ref<SVGSVGElement>,
): JSX.Element {
  const [iconPathStr, setIconPathStr] = useState('');
  const _style: React.CSSProperties = {
    ...style,
    width: typeof size === 'string' ? size : `${size}px`,
    height: typeof size === 'string' ? size : `${size}px`,
    fill: color,
  };

  useEffect((): (() => void) => {
    let isUnmount = false;
    getIconInSprite.getIconById(svgSprite, name).then((icon) => {
      !isUnmount && setIconPathStr(icon.innerHTML);
    });
    return () => (isUnmount = true);
  }, [name]);

  return (
    <svg
      ref={ref}
      data-name={name}
      style={_style}
      className={'ofa-svg-icon ' + className}
      viewBox="0 0 24 24"
      dangerouslySetInnerHTML={{ __html: iconPathStr }}
    />
  );
}

export default React.forwardRef(Icon);
