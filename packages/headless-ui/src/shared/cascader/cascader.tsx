import React, { ForwardedRef, forwardRef, useState } from 'react';

import './index.scss';
import cs from 'classnames';

import usePopper from '../popper';
import Display from './components/display';
import RenderOptions from './components/renderOptions';
import Search from './components/search';
import { useTree } from './hooks';
import { getTreeNodeByOrigin, getOriginInfoByPath, getPathLastValue, getPathByChecked, Tree } from './utils';

interface SingleProps extends SingleCascaderProps {
  multiple: false;
  model: SingleCascaderModelType;
}

interface MultipleProps extends MultipleCascaderProps {
  multiple: true;
  model: MultipleCascaderModelType;
}

function Cascader(
  {
    options = [],
    className,
    style,
    value,
    defaultValue,
    disabled,
    showSearch,
    popupClassName,
    popupPlacement = 'bottom-start',
    expandTrigger = 'hover',
    notFoundContent,
    model = 'single',
    placeholder,
    expandIcon,
    suffixIcon,
    onChange,
    loadData,
    onPopupVisibleChange,
    selectedOptionRender,
    dropdownRender = (menus) => menus,
    multiple,
  }: SingleProps | MultipleProps,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const [selectedValue, setSelectedValue] = useState(defaultValue || value || []);
  const [selectedPath, setSelectedPath] = useState<Tree<CascaderOptionType>[] | Tree<CascaderOptionType>[][]>([]);
  const [expandNodes, setExpandNodes] = useState<Tree<CascaderOptionType>[]>([]);
  const [popperVisible, setPopperVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { forest, changeChecked, clear } = useTree({
    origin: options,
    defaultValue: selectedValue,
    model,
    hasLoad: !!loadData,
    onChange: () => {
      if (multiple) {
        const path = getPathByChecked(true, forest);
        const { origins, value } = getOriginInfoByPath(path);
        const lastValue = getPathLastValue(true, value);
        setSelectedPath(path);
        setSelectedValue(lastValue);

        onChange?.(lastValue, origins);
      } else {
        const path = getPathByChecked(false, forest);
        const { origins, value } = getOriginInfoByPath(path);
        const lastValue = getPathLastValue(false, value);
        setSelectedPath(path);
        setSelectedValue(lastValue);

        onChange?.(lastValue, origins);
        setExpandNodes(path);
      }
    },
  });

  const { referenceRef, Popper, handleClick, close } = usePopper((popperShow: boolean): void => {
    onPopupVisibleChange?.(popperShow);
    setPopperVisible(popperShow);
  });

  function handleDelete(option: CascaderOptionType) {
    const deleteNode = getTreeNodeByOrigin(forest, option);
    if (!deleteNode) return;
    changeChecked(deleteNode, false);
  }

  function handleClickDisplay(e: React.MouseEvent) {
    if (showSearch && popperVisible) return;
    handleClick()(e);
  }

  return (
    <div ref={ref} className={cs('ofa-cascader', className)} style={style}>
      {multiple ? (
        <Display
          ref={referenceRef as any}
          selectedPath={selectedPath as Tree<CascaderOptionType>[][]}
          disabled={disabled}
          showSearch={showSearch}
          isActive={popperVisible}
          placeholder={placeholder}
          suffixIcon={suffixIcon}
          multiple={multiple}
          onClick={handleClickDisplay}
          onClear={clear}
          onDelete={handleDelete}
          onChangeSearch={setSearchText}
          selectedOptionRender={selectedOptionRender}
        />
      ) : (
        <Display
          ref={referenceRef as any}
          selectedPath={selectedPath as Tree<CascaderOptionType>[]}
          disabled={disabled}
          showSearch={showSearch}
          isActive={popperVisible}
          placeholder={placeholder}
          suffixIcon={suffixIcon}
          multiple={multiple}
          onClick={handleClickDisplay}
          onClear={clear}
          onDelete={handleDelete}
          onChangeSearch={setSearchText}
          selectedOptionRender={selectedOptionRender}
        />
      )}
      <Popper placement={popupPlacement} className={cs('ofa-cascader-popper', popupClassName)}>
        <>
          {
            searchText && showSearch ? 
              <Search
                showSearch={showSearch}
                forest={forest}
                searchText={searchText}
                model={model}
                onChangeChecked={changeChecked}
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
                  onChangeChecked={changeChecked}
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
