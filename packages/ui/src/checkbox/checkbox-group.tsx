import React, { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes, useEffect, useState } from 'react';

import Checkbox from './index';

type CheckboxValueType = string | number;

interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  disabled?: boolean;
}

interface Props {
  'data-node-key'?: string;
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  disabled?: boolean;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
  options?: Array<CheckboxOptionType> | Array<string>;
}

function CheckboxGroup({
  defaultValue,
  value,
  disabled,
  options = [],
  onChange,
  ...rest
}: Props,
ref: ForwardedRef<HTMLDivElement>): JSX.Element {
  const _options = options.map((option: CheckboxOptionType | string) => {
    if (typeof option === 'string') {
      return {
        label: option,
        value: option,
      };
    }
    return option;
  });

  const [checkedValue, setCheckedValue] = React.useState<CheckboxValueType[]>(
    value || defaultValue || [],
  );
  const dataNodeKey = rest['data-node-key'] || '';

  React.useEffect(() => {
    if (value) {
      setCheckedValue(value || []);
    }
  }, [value]);

  const toggleOption = (option: CheckboxOptionType): void => {
    const newValue = new Set(checkedValue);
    const isExist = newValue.has(option.value);
    if (!isExist) {
      newValue.add(option.value);
    } else {
      newValue.delete(option.value);
    }
    const arrayValue = Array.from(newValue);
    if (!value) {
      setCheckedValue(arrayValue);
    }
    onChange?.(arrayValue);
  };

  let children;
  if (options && options.length > 0) {
    children = _options.map((option: CheckboxOptionType) => {
      return (
        <Checkbox
          key={option.value}
          disabled={option.disabled || disabled}
          value={option.value}
          checked={checkedValue.indexOf(option.value) !== -1}
          label={option.label as string}
          onChange={() => toggleOption(option)}
          className="mr-20"
        />
      );
    });
  }

  return (
    <div ref={ref} data-node-key={dataNodeKey} className="flex items-center flex-wrap">
      {children}
    </div>
  );
}

export default forwardRef(CheckboxGroup);
