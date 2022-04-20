import React, { useEffect, useState } from 'react';
import getIconPathById from './getIconPathById';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  color?: string;
}

function Icon(
  { name, size = 16, color, className = '', style, ...props }: IconProps,
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
    getIconPathById(name).then((iconPath) => {
      !isUnmount && setIconPathStr(iconPath);
    });
    return () => (isUnmount = true);
  }, [name]);

  return (
    <svg
      {...props}
      ref={ref}
      data-name={name}
      style={_style}
      className={'ofa-svg-icon ' + className}
      viewBox="0 0 24 24"
      dangerouslySetInnerHTML={{ __html: iconPathStr }}
    />
  );
}

export default React.forwardRef<SVGSVGElement, IconProps>(Icon);
