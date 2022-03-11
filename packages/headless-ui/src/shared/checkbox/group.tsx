import React, {
  useState,
  useEffect,
  forwardRef,
  memo,
  ChangeEvent,
  ForwardedRef,
  PropsWithChildren,
} from 'react';
import cs from 'classnames';

import Checkbox from './checkbox';
import GroupContext from './context';

function InternalCheckboxGroup<T extends ValueType>(
  {
    className,
    style,
    options = [],
    disabled,
    children,
    onChange,
    ...restProps
  }: PropsWithChildren<CheckboxGroupProps<T>>,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const [value, setValue] = useState<T[]>(restProps.value || []);
  const [registeredValues, setRegisteredValues] = useState<T[]>([]);

  useEffect(() => {
    setValue(restProps.value || []);
  }, [restProps.value]);

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

  const cancelValue = (val: T): void => {
    setRegisteredValues((prevValues) => prevValues.filter((v) => v !== val));
  };

  const registerValue = (val: T): void => {
    setRegisteredValues((prevValues) => [...prevValues, val]);
  };

  const toggleOption = (option: OptionType<T>): void => {
    const optionIndex = value.indexOf(option.value);
    const newValue = [...value];
    if (optionIndex === -1) {
      newValue.push(option.value);
    } else {
      newValue.splice(optionIndex, 1);
    }
    setValue(newValue);
    const opts = getOptions();
    onChange?.(
      newValue
        .filter((val) => registeredValues.indexOf(val) !== -1)
        .sort((a, b) => {
          const indexA = opts.findIndex((opt) => opt.value === a);
          const indexB = opts.findIndex((opt) => opt.value === b);
          return indexA - indexB;
        }),
    );
  };

  let child = children;

  if (options && options.length > 0) {
    child = getOptions().map((option) => (
      <Checkbox
        key={option.value.toString()}
        disabled={'disabled' in option ? option.disabled : disabled}
        label={option.label}
        value={option.value}
        checked={value.indexOf(option.value) !== -1}
        onChange={option.onChange as (val: ValueType, e: ChangeEvent<HTMLInputElement>) => void}
      ></Checkbox>
    ));
  }

  const context = {
    value,
    disabled: !!disabled,
    name: restProps.name,
    toggleOption,
    registerValue,
    cancelValue,
  };

  return (
    <div ref={ref} style={style} className={cs({ 'checkbox-group-wrapper__disbaled': disabled }, className)}>
      <GroupContext.Provider value={context}>{child}</GroupContext.Provider>
    </div>
  );
}

const CheckboxGroup = forwardRef<HTMLDivElement, PropsWithChildren<CheckboxGroupProps<ValueType>>>(
  InternalCheckboxGroup,
);

export default memo(CheckboxGroup);
