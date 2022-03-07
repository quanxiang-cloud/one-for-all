import React, { ForwardedRef, forwardRef } from 'react';
import { RadioGroup, Radio } from '@one-for-all/ui';

export interface Props {
  'data-node-key': string;
  radioOptions: string;
  id?: string;
  disabled?: boolean;
  currentValue?: string | number | boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: string | number | boolean) => void;
}

function RadioGroupElm({
  currentValue,
  disabled,
  radioOptions='',
  onChange,
  ...rest
}: Props, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
  const turnRadioOption = radioOptions.split(/\r?\n/).map((option: string) => {
    return option.trim().slice(0, 15);
  }).filter(Boolean);

  return (
    <RadioGroup
      onChange={(v: string | number | boolean) => onChange?.(v)}
    >
      {turnRadioOption.map((label) => {
        return (
          <Radio
            className='inline-block'
            key={label}
            label={label}
            value={label}
            disabled={disabled}
            defaultChecked={currentValue === label}
          />
        );
      })}
    </RadioGroup>
  );
}

export default forwardRef(RadioGroupElm);
