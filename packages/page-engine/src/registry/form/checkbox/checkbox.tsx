import React, { ForwardedRef, forwardRef } from 'react';
import { CheckboxGroup } from '@one-for-all/ui';

export interface Props {
  id?: string;
  checkboxOptions: string;
  'data-node-key': string;
  disabled?: boolean;
  currentValue?: string | number | boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange: (value: Array<string | number> ) => void;
}

function CheckboxElm({
  currentValue,
  disabled,
  checkboxOptions='',
  onChange,
  ...rest
}: Props, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
  const turnCheckboxOption = checkboxOptions.split(/\r?\n/).map((option: string) => {
    const optionValue = option.trim().slice(0, 15)
    return {label: optionValue, value: optionValue};
  }).filter(Boolean);

  return (
    <CheckboxGroup
      {...rest}
      options={turnCheckboxOption}
      onChange={(value: Array<string | number>) => onChange(value)}
    />
  );
}

export default forwardRef(CheckboxElm);
