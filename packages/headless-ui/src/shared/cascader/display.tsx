import React, { forwardRef, ForwardedRef, useState, useMemo, useEffect } from 'react';
import Icon from '@one-for-all/icon';
import cs from 'classnames';

import Tag from '../tag';
import { isMultiple, getOriginInfoByPath, Tree } from './utils';

type Props = {
  placeholder?: string;
  id?: string;
  selectedPath: Tree<CascaderOptionType>[] | Tree<CascaderOptionType>[][];
  model: CascaderModelType;
  disabled?: boolean;
  isActive: boolean;
  showSearch?: boolean | ShowSearchType;
  suffixIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  onClear?: () => void;
  onDelete?: (option: CascaderOptionType) => void;
  onChangeSearch?: (searchText: string) => void;
  displayRender?: (
    label: React.ReactNode[] | React.ReactNode[][],
    selectedOptions?: CascaderOptionType[] | CascaderOptionType[][],
  ) => React.ReactNode;
};

function Display(
  {
    placeholder = '请选择...',
    id,
    selectedPath,
    model,
    disabled,
    isActive,
    showSearch,
    suffixIcon,
    onClick,
    onClear,
    onDelete,
    onChangeSearch,
    displayRender,
  }: Props,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const [hover, setHover] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    onChangeSearch?.(searchText);
  }, [searchText]);

  useEffect(() => {
    if (!isActive) setSearchText('');
  }, [isActive]);

  const { value, label, origins: selectedOptions } = useMemo(() => {
    return getOriginInfoByPath<CascaderOptionType>(selectedPath);
  }, [selectedPath])

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
    setSearchText('');
    setHover(false);
  };

  const handleDelete = (e: React.MouseEvent, option: CascaderOptionType) => {
    e.stopPropagation();
    onDelete?.(option);
  }

  const handelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }

  const _displayRender = (
    label: React.ReactNode[] | React.ReactNode[][],
    selectedOptions?: CascaderOptionType[] | CascaderOptionType[][],
  ): React.ReactNode => {
    if (!!displayRender) return displayRender(label, selectedOptions);
    if (isMultiple(model)) return renderMultipleLabel(label as React.ReactNode[][], selectedOptions as CascaderOptionType[][]);
    return <span>{ label.join('/') }</span>;
  }

  const renderMultipleLabel = (label: React.ReactNode[][], selectedOptions: CascaderOptionType[][]): React.ReactNode => {
    return <>
      {
        label.map((labelPath, index) => (
          <Tag
            key={index}
            value={index}
            label={labelPath[labelPath.length - 1]}
            style={{ marginRight: 5 }}
            onDelete={(value, e) => handleDelete(e, selectedOptions[index][selectedOptions[index].length -1])}
          />
        ))
      }
    </>
  }

  return (
    <div
      ref={ref}
      className={cs('ofa-cascader-display', isActive && 'is-active', disabled && 'is-disabled')}
      onClick={handleShow}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="ofa-cascader-display-box">
        <div className={cs('ofa-cascader-display-value')}>
          {!searchText && _displayRender(label, selectedOptions)}
        </div>
        <input
          id={id}
          value={searchText}
          onChange={handelSearch}
          readOnly={!showSearch}
          placeholder={ value.length ? '' : placeholder }
        />
      </div>
      <span onClick={handleClear}>
        {hover ? <Icon name="close" /> : suffixIcon || <Icon name="expand_more" />}
      </span>
    </div>
  );
}

export default forwardRef(Display);
