import React from 'react';
import { RadioGroup, Radio } from '@one-for-all/ui';

export interface Props {
  id?: string;
  radioOptions: string;
  'data-node-key': string;
  disabled?: boolean;
  currentValue?: string | number | boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange: (value: string | number | boolean) => void;
}

function RadioGroupElm({
  currentValue,
  disabled,
  radioOptions='',
  onChange,
  ...rest
}: Props, ref: React.Ref<HTMLDivElement>): JSX.Element {
  const turnRadioOption = radioOptions.split(/\r?\n/).map((option: string) => {
    return option.trim().slice(0, 15);
  }).filter(Boolean);

  return (
    <RadioGroup 
      {...rest}
      ref={ref}
      className='flex'
      onChange={(v: string) => onChange && onChange(v)}
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

export default React.forwardRef(RadioGroupElm);
