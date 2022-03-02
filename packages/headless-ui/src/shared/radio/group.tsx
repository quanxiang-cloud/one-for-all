import React, { ForwardedRef, useState, useEffect, forwardRef, memo, PropsWithChildren } from 'react';
import cs from 'classnames';

import Radio from './radio';
import GroupContext from './context';

function InternalRadioGroup<T extends ValueType>(
  {
    className,
    style,
    options = [],
    children,
    disabled,
    onChange,
    name,
    ...restProps
  }: PropsWithChildren<RadioGroupProps<T>>,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const [value, setValue] = useState<T | undefined>(restProps.value);

  useEffect(() => {
    setValue(restProps.value);
  }, [restProps.value]);

  const onRadioChange = (val: T): void => {
    const lastValue = value;
    setValue(val);
    if (onChange && val !== lastValue) {
      onChange(val);
    }
  };

  const getOptions = (): OptionType<T>[] =>
    options.map((option) => {
      if (typeof option === 'string') {
        return {
          label: option,
          value: option,
        };
      }
      return option;
    }) as OptionType<T>[];

  let child = children;

  if (options && options.length > 0) {
    child = getOptions().map((option) => (
      <Radio
        key={option.value.toString()}
        disabled={option.disabled || disabled}
        label={option.label}
        value={option.value}
        checked={value === option.value}
        onChange={option.onChange as (val: ValueType, e: React.ChangeEvent<HTMLInputElement>) => void}
      ></Radio>
    ));
  }

  const context = {
    value,
    disabled: !!disabled,
    name: name,
    onChange: onRadioChange,
  };

  return (
    <div
      className={cs(
        { 'radio-group-wrapper__disbaled': disabled },
        className,
      )}
      style={style}
      ref={ref}
    >
      <GroupContext.Provider value={context}>{child}</GroupContext.Provider>
    </div>
  );
}

const RadioGroup =
  forwardRef<HTMLDivElement, PropsWithChildren<RadioGroupProps<ValueType>>>(InternalRadioGroup);

export default memo(RadioGroup);
