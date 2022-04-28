import React, { ForwardedRef, forwardRef, useState } from 'react';

import './index.scss';
import cs from 'classnames';

import usePopper from '../popper';
import Display from './display';
import RenderOptions from './renderOptions';
import Search from './search';
import { useTree } from './hooks';
import { getTreeNodeByOrigin, isMultiple, getOriginInfoByPath, Tree } from './utils';

function Cascader(
  {
    options = [],
    className,
    style,
    value,
    defaultValue,
    id,
    name,
    disabled,
    showSearch,
    popupClassName,
    popupPlacement = 'bottom-start',
    expandTrigger = 'click',
    notFoundContent,
    model = 'single',
    placeholder,
    expandIcon,
    suffixIcon,
    onChange,
    loadData,
    onPopupVisibleChange,
    displayRender,
    dropdownRender = (menus) => menus,
  }: CascaderProps,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const [selectedValue, setSelectedValue] = useState(defaultValue || value || []);
  const [selectedPath, setSelectedPath] = useState<Tree<CascaderOptionType>[] | Tree<CascaderOptionType>[][]>([]);
  const [expandNodes, setExpandNodes] = useState<Tree<CascaderOptionType>[]>([]);
  const [popperVisible, setPopperVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { forest, checked, clear } = useTree({
    origin: options,
    defaultValue: selectedValue,
    model,
    hasLoad: !!loadData,
    onChange: (path) => {
      const { origins, value } = getOriginInfoByPath(path);
      setSelectedPath(path);
      setSelectedValue(value);

      onChange?.(value, origins);
      if (!isMultiple(model)) {
        setExpandNodes(path as Tree<CascaderOptionType>[]);
      }
    },
  });

  const { referenceRef, Popper, handleClick, close } = usePopper((popperShow: boolean): void => {
    onPopupVisibleChange?.(popperShow);
    setPopperVisible(popperShow);
  });

  const handleDelete = (option: CascaderOptionType) => {
    const deleteNode = getTreeNodeByOrigin(forest, option);
    if (!deleteNode) return;
    checked(deleteNode, false);
  }

  const handleClickDisplay = (e: React.MouseEvent) => {
    if (showSearch && popperVisible) return;
    handleClick()(e);
  }

  return (
    <div ref={ref} className={cs('ofa-cascader', className)} style={style}>
      <label>{name}</label>
      <Display
        ref={referenceRef as any}
        id={id}
        selectedPath={selectedPath}
        disabled={disabled}
        showSearch={showSearch}
        isActive={popperVisible}
        placeholder={placeholder}
        suffixIcon={suffixIcon}
        model={model}
        onClick={handleClickDisplay}
        onClear={clear}
        onDelete={handleDelete}
        onChangeSearch={setSearchText}
        displayRender={displayRender}
      />
      <Popper placement={popupPlacement} className={cs('ofa-cascader-popper', popupClassName)}>
        <>
          {
            searchText && showSearch ? 
              <Search
                showSearch={showSearch}
                forest={forest}
                searchText={searchText}
                model={model}
                onChecked={checked}
                onClose={close}
              />
            :
              dropdownRender(
                <RenderOptions
                  forest={forest}
                  expandNodes={expandNodes}
                  expandTrigger={expandTrigger}
                  expandIcon={expandIcon}
                  notFoundContent={notFoundContent}
                  model={model}
                  onChecked={checked}
                  onExpandNodes={setExpandNodes}
                  onClose={close}
                  loadData={loadData}
                />,
              )
          }
        </>
      </Popper>
    </div>
  );
}

export default forwardRef(Cascader);
