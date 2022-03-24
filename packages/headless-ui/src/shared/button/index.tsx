import React, { forwardRef, Ref } from 'react';
import cs from 'classnames';

// import Icon from '@one-for-all/icon';

import './index.scss';

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
    onClick,
    size,
    ...rest
  }: ButtonProps,
  ref?: Ref<HTMLButtonElement>,
): JSX.Element {
  return (
    <button
      {...rest}
      onClick={onClick}
      type={type}
      ref={ref}
      className={cs('ofa-btn', className, {
        [`ofa-btn--${modifier}`]: modifier,
        [`ofa-btn--${size}`]: size,
        'ofa-btn--forbidden': forbidden,
        'ofa-btn--loading': loading,
      })}
      disabled={forbidden}
    >
      {/* {(iconName || loading) && (
        <Icon
          name={loading ? 'refresh' : iconName || 'refresh'}
          size={Number(iconSize)}
          className={cs('ofa-btn-icon', iconClassName)}
        />
      )} */}
      <span className={textClassName}>{!loading && children}</span>
    </button>
  );
}

export default forwardRef(Button);
