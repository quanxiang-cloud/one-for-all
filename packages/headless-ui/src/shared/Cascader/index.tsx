import React, { ForwardedRef, forwardRef, useState } from 'react';

import './index.scss';
import cs from 'classnames';

import usePopper from '../popper';
import Display from './display';
import RenderOptions from './renderOptions';

import { useTree, Tree } from './hooks';

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
    popupClassName,
    popupPlacement = 'bottom-start',
    expandTrigger = 'click',
    changeOnSelect = false,
    notFoundContent,
    multipleSelect = false,
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
  const [selectedLabel, setSelectedLabel] = useState<React.ReactNode[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<CascaderOptionType[] | CascaderOptionType[][]>([]);
  const [expandNodes, setExpandNodes] = useState<Tree<CascaderOptionType>[]>([]);
  const [popperVisible, setPopperVisible] = useState(false);

  const { forest, checked, clear, getOriginInfo } = useTree({
    origin: options,
    defaultValue: selectedValue,
    isMultiple: multipleSelect,
    hasLoad: !!loadData,
    onChange: (path) => {
      const { pathOfOrigin, pathOfLabel, pathOfValue } = getOriginInfo(path);
      setSelectedOptions(pathOfOrigin);
      setSelectedValue(pathOfValue);
      setSelectedLabel(pathOfLabel);

      onChange?.(pathOfValue, pathOfOrigin);
      if (!multipleSelect) {
        setExpandNodes(path as Tree<CascaderOptionType>[]);
      }
    },
  });

  const { referenceRef, Popper, handleClick, close } = usePopper((popperShow: boolean): void => {
    onPopupVisibleChange?.(popperShow);
    setPopperVisible(popperShow);
  });

  return (
    <div ref={ref} className={cs('ofa-cascader', className)} style={style}>
      <label>{name}</label>
      <Display
        ref={referenceRef as any}
        id={id}
        value={selectedValue}
        label={selectedLabel}
        selectedOptions={selectedOptions}
        disabled={disabled}
        popperVisible={popperVisible}
        placeholder={placeholder}
        suffixIcon={suffixIcon}
        onClick={handleClick()}
        onClear={clear}
        displayRender={displayRender}
      />
      <Popper placement={popupPlacement} className={cs('ofa-cascader-popper', popupClassName)}>
        <>
          {dropdownRender(
            <RenderOptions
              forest={forest}
              expandNodes={expandNodes}
              multipleSelect={multipleSelect}
              expandTrigger={expandTrigger}
              expandIcon={expandIcon}
              notFoundContent={notFoundContent}
              changeOnSelect={changeOnSelect}
              onChecked={checked}
              onExpandNodes={setExpandNodes}
              onClose={close}
              loadData={loadData}
            />,
          )}
        </>
      </Popper>
    </div>
  );
}

export default forwardRef(Cascader);
