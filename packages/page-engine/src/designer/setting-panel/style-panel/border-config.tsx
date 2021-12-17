import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import { RadioButtonGroup, Icon } from '@ofa/ui';

type LabelValue = {
  label: string;
  value: string;
}

const BORDER_LIST: LabelValue[] = [
  { value: 'none', label: '无' },
  { value: 'solid', label: '实线' },
  { value: 'dashed', label: '虚线' },
];

interface Props {
  initValues: Record<string, string | number>;
  register: UseFormRegister<FieldValues>;
  setValue: any;
  onFormChange: () => void;
}

function BorderConfig({ initValues, register, setValue, onFormChange }: Props): JSX.Element {
  const [borderType, setBorderType] = useState('none');

  useEffect(() => {
    const _type = (initValues.borderStyle || 'dashed') as string;
    setBorderType(_type);
  }, []);

  function handleRadioChange(value: string): void {
    if (borderType === value) return;
    setValue('borderStyle', value);
    setBorderType(value);
    onFormChange();
  }

  return (
    <div>
      <div className='text-12 text-gray-600'>填充类型</div>
      <RadioButtonGroup
        listData={BORDER_LIST}
        onChange={(val)=> handleRadioChange(val + '')}
        currentValue={borderType}
      />
      {borderType !== 'none' && (
        <div className='mt-8 p-8 border border-gray-300 rounded-4'>
          <div className='flex items-center'>
            <div className='mr-8 w-2/5 flex items-center'>
              <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>宽度</span>
              <input
                type="number"
                className='px-8 w-full border-none focus:outline-none'
                {...register('borderWidth', { value: initValues.borderWidth || 1 })}
              />
            </div>
            {/* <div className='mr-32 w-2/5 flex items-center'>
              <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>边角</span>
              <input
                type="text"
                className='px-8 w-full border-none focus:outline-none'
                {...register('borderRadius', { value: initValues.borderRadius || 0 })}
              />
            </div> */}
            <Icon name='fullscreen' color='gray' />
          </div>
          <div className='mt-8 flex items-center'>
            <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>边角大小</span>
            <ul className='w-full flex items-center justify-around'>
              <li style={{ width: 30 }}>
                <input
                  type="text"
                  className='w-full text-center border-none focus:outline-none'
                  {...register('borderTopLeftRadius', { value: initValues.borderTopLeftRadius || 0 })}
                />
              </li>
              <li style={{ width: 30 }}>
                <input
                  type="text"
                  className='w-full text-center border-none focus:outline-none'
                  {...register('borderTopRightRadius', { value: initValues.borderTopRightRadius || 0 })}
                />
              </li>
              <li style={{ width: 30 }}>
                <input
                  type="text"
                  className='w-full text-center border-none focus:outline-none'
                  {...register('borderBottomRightRadius', { value: initValues.borderBottomRightRadius || 0 })}
                />
              </li>
              <li style={{ width: 30 }}>
                <input
                  type="text"
                  className='w-full text-center border-none focus:outline-none'
                  {...register('borderBottomLeftRadius', { value: initValues.borderBottomLeftRadius || 0 })}
                />
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default BorderConfig;
