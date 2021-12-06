import React from 'react';
import cs from 'classnames';

import svgHash from './svg-hash';

export interface Props extends React.SVGProps<SVGSVGElement> {
  name: string;
  color?:
    | 'red'
    | 'yellow'
    | 'green'
    | 'gray'
    | 'blue'
    | 'white'
    | 'rose'
    | 'pink'
    | 'purple'
    | 'orange'
    | 'primary';
  size?: number;
  disabled?: boolean;
  changeable?: boolean;
  clickable?: boolean;
}

function Icon(
  {
    name,
    size = 16,
    color,
    changeable,
    disabled,
    clickable,
    className,
    style,
    ...props
  }: Props,
  ref?: React.Ref<SVGSVGElement>,
): JSX.Element {
  const _style: React.CSSProperties = {
    ...style,
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <svg
      {...props}
      ref={ref}
      data-name={name}
      style={_style}
      className={cs('svg-icon', className, {
        'svg-icon--changeable': changeable,
        'svg-icon--clickable': clickable,
        'svg-icon--disabled': disabled,
        [`svg-icon--${color}`]: color,
      })}
    >
      <use xlinkHref={`${svgHash}#${name}`} />
    </svg>
  );
}

export default React.forwardRef(Icon);
