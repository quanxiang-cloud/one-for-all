import React, { forwardRef, ForwardedRef, useState } from 'react';
import Icon from '@one-for-all/icon';

import cs from 'classnames';

type Props = {
  placeholder?: string;
  id?: string;
  value: CascaderValue;
  label: React.ReactNode[];
  selectedOptions: CascaderOptionType[] | CascaderOptionType[][];
  disabled?: boolean;
  popperVisible: boolean;
  suffixIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  onClear?: () => void;
  displayRender?: (
    label: React.ReactNode[],
    selectedOptions?: CascaderOptionType[] | CascaderOptionType[][],
  ) => React.ReactNode;
};

function Display(
  {
    placeholder = '请选择...',
    id,
    value,
    label,
    selectedOptions,
    disabled,
    popperVisible,
    suffixIcon,
    onClick,
    onClear,
    displayRender = (label) => label.join('/'),
  }: Props,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const [hover, setHover] = useState(false);

  const handleShow = (e: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(e);
  };

  const handleMouseEnter = () => {
    if (disabled || !value.length) return;
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    if (!hover) return;
    e.stopPropagation();
    onClear?.();
    setHover(false);
  };

  return (
    <div
      ref={ref}
      className={cs('ofa-cascader-display', popperVisible && 'is-active', disabled && 'is-disabled')}
      onClick={handleShow}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={cs('ofa-cascader-display-value', !value.length && 'is-placeholder')}>
        {!!value.length ? displayRender(label, selectedOptions) : placeholder}
        <input type="hidden" value={value as string[]} id={id} />
      </span>
      <span onClick={handleClear}>
        {hover ? <Icon name="close" /> : suffixIcon || <Icon name="expand_more" />}
      </span>
    </div>
  );
}

export default forwardRef(Display);
