import React from 'react';
import cs from 'classnames';

import Radio from './index';
import RadioGroup from './group';

import './radio-button-group.scss';

type LabelValue = { label: string, value: string }

type Props = {
  listData: LabelValue[];
  onChange: (value: string | number | boolean) => void;
  disabled?: boolean;
  currentValue?: string | number | boolean;
  radioBtnClass?: string;
  className?: string;
  radioLabelRender?: (data: LabelValue) => string
}

export default function RadioButtonGroup(
  { listData, currentValue, disabled, onChange, className: groupWrapClass, radioBtnClass, radioLabelRender }
    : Props): JSX.Element {
  return (
    <div className={cs('radio-btn-group-wrap flex items-center', groupWrapClass)}>
      <RadioGroup
        onChange={onChange}
      >
        {
          listData?.map(({ label, value }) => (
            <Radio
              disabled={disabled}
              key={value}
              label={radioLabelRender ? radioLabelRender({ label, value }) : label}
              value={value}
              radioClass="hidden"
              className={cs(
                'radio-group-btn justify-center border-1 border-gray-300 -ml-1',
                {
                  'radio-group-btn-active bg-blue-100': currentValue === value,
                  'hover:bg-blue-100': !disabled,
                  'opacity-60': disabled,
                },
                radioBtnClass,
              )}
              defaultChecked={currentValue === value}
            />
          ))}
      </RadioGroup>
    </div>
  );
}
