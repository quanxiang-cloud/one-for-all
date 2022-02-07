import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldValues, UseFormSetValue } from 'react-hook-form';

import { RadioButtonGroup } from '@one-for-all/ui';

type LabelValue = {
  label: string;
  value: string;
}

const POSITION_LIST: LabelValue[] = [
  { value: 'static', label: '默认' },
  { value: 'relative', label: '相对' },
  { value: 'absolute', label: '绝对' },
  { value: 'fixed', label: '固定' },
];

interface Props {
  register: UseFormRegister<FieldValues>;
  initValues: Record<string, string | number>;
  setValue: UseFormSetValue<FieldValues>;
}

function PositionConfig({ initValues, register, setValue }: Props): JSX.Element {
  const [positionStatus, setPositionStatus] = useState('static');
  const { position } = initValues;

  useEffect(() => {
    setPositionStatus((position || 'static') as string);
  }, [position]);

  function handleRadioChange(value: string | number | boolean): void {
    const _value = value as string;
    if (_value === 'static') {
      setValue('top', '');
      setValue('left', '');
      setValue('right', '');
      setValue('bottom', '');
    }
    setPositionStatus(_value);
    setValue('position', _value);
  }

  return (
    <div>
      <div className='text-12 text-gray-600 mb-4'>定位</div>
      <RadioButtonGroup
        listData={POSITION_LIST}
        onChange={(val) => handleRadioChange(val)}
        currentValue={positionStatus}
      />
      {positionStatus !== 'static' && (
        <>
          <div
            className='mt-8 px-4 border border-dashed border-gray-400 bg-blue-200 rounded-4'
          >
            <div className='h-28 flex items-center justify-center'>
              <input
                type="text"
                className='input-number bg-transparent text-center focus:outline-none'
                style={{ backgroundColor: 'transparent' }}
                placeholder='0'
                {...register('top', {
                  value: initValues['top'] || '',
                })}
              />
            </div>
            <div className='flex items-center '>
              <div className='w-32'>
                <input
                  type="text"
                  className='w-full bg-transparent text-center focus:outline-none'
                  style={{ backgroundColor: 'transparent' }}
                  placeholder='0'
                  {...register('left', {
                    value: initValues['left'] || '',
                  })}
                />
              </div>
              <div
                className='w-full h-full bg-white text-12 text-center text-gray-400 rounded-4'
                style={{ height: 42 }}
              ></div>
              <div className='w-32'>
                <input
                  type="text"
                  className='w-full bg-transparent text-center focus:outline-none'
                  style={{ backgroundColor: 'transparent' }}
                  placeholder='0'
                  {...register('right', {
                    value: initValues['right'] || '',
                  })}
                />
              </div>
            </div>
            <div className='h-28 flex items-center justify-center'>
              <input
                type="text"
                className='bg-transparent text-center focus:outline-none'
                style={{ backgroundColor: 'transparent' }}
                placeholder='0'
                {...register('bottom', {
                  value: initValues['bottom'] || '',
                })}
              />
            </div>
          </div>
          <div className='mt-8'>
            <div className='text-12 text-gray-600'>层级</div>
            <input
              type="number"
              placeholder="0"
              className='mr-8 px-8 py-6 w-full border border-gray-300 corner-2-8-8-8'
              {...register('zIndex', { value: initValues['zIndex'] || '' })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PositionConfig;
