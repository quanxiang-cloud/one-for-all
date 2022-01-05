import React, { forwardRef, Ref } from 'react';
import cs from 'classnames';

import Icon from '../icon';

interface Props
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement> {
  size?: 'normal' | 'compact';
  modifier?: 'primary' | 'danger';
  loading?: boolean;
  forbidden?: boolean;
  iconName?: string;
  iconSize?: number;
  textClassName?: string;
  iconClassName?: string;
}

function Button(
  {
    children,
    iconName,
    className,
    modifier,
    forbidden,
    loading,
    iconSize = 20,
    textClassName,
    iconClassName,
    type = 'button',
    size,
    ...rest
  }: Props,
  ref?: Ref<HTMLButtonElement>,
): JSX.Element {
  // console.log('button的ref', ref);
  return (
    <button
      {...rest}
      type={type}
      ref={ref}
      className={cs('btn', className, {
        [`btn--${modifier}`]: modifier,
        'btn--forbidden': forbidden,
        'btn--loading': loading,
        'opacity-50': forbidden,
        'pointer-events-none': loading || forbidden,
        'h-26': size === 'compact',
      })}
      disabled={forbidden}
    >
      {(iconName || loading) && (
        <Icon
          name={loading ? 'refresh' : iconName || 'refresh'}
          type={modifier === 'primary' ? 'light' : 'dark'}
          size={iconSize}
          className={cs('fill-current text-inherit mr-4', iconClassName, {
            'animate-spin': loading,
            'pointer-events-none': loading || forbidden,
          })}
        />
      )}
      <span className={textClassName}>{!loading && children}</span>
    </button>
  );
}

export default forwardRef(Button);
