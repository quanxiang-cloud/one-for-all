import React, { forwardRef, ForwardedRef, useState, useMemo, useEffect } from 'react';
import Icon from '@one-for-all/icon';
import cs from 'classnames';

import Tag from '../../tag';
import { getOriginInfoByPath, Tree } from '../utils';

interface BaseProps {
  placeholder?: string;
  disabled?: boolean;
  isActive: boolean;
  showSearch?: boolean | ShowSearchType;
  suffixIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  onClear?: () => void;
  onDelete?: (option: CascaderOptionType) => void;
  onChangeSearch?: (searchText: string) => void;
};

interface SingleProps extends BaseProps {
  selectedPath: Tree<CascaderOptionType>[];
  selectedOptionRender?: (label: React.ReactNode[], selectedOptions: CascaderOptionType[]) => React.ReactNode;
  multiple: false;
};

interface MultipleProps extends BaseProps {
  selectedPath: Tree<CascaderOptionType>[][];
  selectedOptionRender?: (label: React.ReactNode[][], selectedOptions: CascaderOptionType[][]) => React.ReactNode;
  multiple: true;
};

function Display(
  {
    placeholder = '请选择...',
    selectedPath,
    disabled,
    isActive,
    showSearch,
    suffixIcon,
    multiple,
    onClick,
    onClear,
    onDelete,
    onChangeSearch,
    selectedOptionRender,
  }: SingleProps | MultipleProps,
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
    if (multiple) return getOriginInfoByPath(selectedPath);
    return getOriginInfoByPath(selectedPath);
  }, [selectedPath])

  function handleShow(e: React.MouseEvent) {
    if (disabled) return;
    onClick?.(e);
  };

  function handleMouseEnter() {
    if (disabled || !value.length) return;
    setHover(true);
  };

  function handleMouseLeave() {
    setHover(false);
  };

  function handleClear(e: React.MouseEvent) {
    if (!hover) return;
    e.stopPropagation();
    onClear?.();
    setSearchText('');
    setHover(false);
  };

  function handleDelete(e: React.MouseEvent, option: CascaderOptionType) {
    e.stopPropagation();
    onDelete?.(option);
  }

  function handelSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  function _displayRender(
    label: React.ReactNode[] | React.ReactNode[][],
    selectedOptions: CascaderOptionType[] | CascaderOptionType[][],
  ): React.ReactNode {
    if (multiple) {
      const _label = label as React.ReactNode[][];
      const _selectedOptions = selectedOptions as CascaderOptionType[][];
      if (!!selectedOptionRender) return selectedOptionRender(_label, _selectedOptions);
      return renderMultipleLabel(_label, _selectedOptions);
    }
    const _label = label as React.ReactNode[];
    const _selectedOptions = selectedOptions as CascaderOptionType[];
    if (!!selectedOptionRender) return selectedOptionRender(_label, _selectedOptions);
    return <span>{ label.join('/') }</span>;
  }

  function renderMultipleLabel(label: React.ReactNode[][], selectedOptions: CascaderOptionType[][]): React.ReactNode {
    return <>
      {
        label.map((labelPath, index) => (
          <Tag
            key={index}
            value={index}
            label={labelPath[labelPath.length - 1]}
            style={{ marginRight: 5, zIndex: 1 }}
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
