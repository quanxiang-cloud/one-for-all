import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import { RadioButtonGroup, Icon } from '@one-for-all/ui';

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
  setValue: (key: string, val: string | number) => void;
  onFormChange: () => void;
}

function BorderConfig({ initValues, register, setValue, onFormChange }: Props): JSX.Element {
  const { borderStyle, borderWidth, borderTopLeftRadius, borderTopRightRadius,
    borderBottomLeftRadius, borderBottomRightRadius } = initValues;
  const [borderType, setBorderType] = useState('none');
  const [opening, setOpening] = useState(false);
  const [borderRadius, setBorderRadius] = useState(0);

  useEffect(() => {
    const _type = (borderStyle || 'none') as string;
    if ((borderTopLeftRadius === borderTopRightRadius) &&
      (borderTopLeftRadius === borderBottomRightRadius) &&
      (borderTopLeftRadius === borderBottomLeftRadius)) {
      setOpening(false);
      setBorderRadius(Number(borderTopLeftRadius) || 0);
    } else {
      setOpening(true);
    }
    setBorderType(_type);
  }, [borderStyle]);

  function handleRadioChange(value: string | number | boolean): void {
    const _value = (value || '') as string;
    if (borderType === _value) return;
    if (borderType === 'none') {
      setValue('borderTopLeftRadius', 0);
      setValue('borderTopRightRadius', 0);
      setValue('borderBottomRightRadius', 0);
      setValue('borderBottomLeftRadius', 0);
      setBorderRadius(0);
    }
    setValue('borderStyle', _value);
    setBorderType(_value);
    onFormChange();
  }

  function handleOpening(): void {
    const _opening = !opening;
    setOpening(_opening);
  }

  function handleChangeRadius(e: React.ChangeEvent<HTMLInputElement>): void {
    const _val = Number(e.target.value) || 0;
    setBorderRadius(_val);
    setValue('borderTopLeftRadius', _val);
    setValue('borderTopRightRadius', _val);
    setValue('borderBottomRightRadius', _val);
    setValue('borderBottomLeftRadius', _val);
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
                {...register('borderWidth', { value: borderWidth || 1 })}
              />
            </div>
            <div className='mr-32 w-2/5 flex items-center'>
              <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>边角</span>
              { opening ? <span className='text-12 text-gray-400'>-</span> : (
                <input
                  type="text"
                  className='px-8 w-full border-none focus:outline-none'
                  value={borderRadius}
                  onChange={handleChangeRadius}
                />
              )}
            </div>
            <Icon name='fullscreen' onClick={handleOpening} color={opening ? 'blue' : 'gray'} />
          </div>
          {opening && (
            <div className='mt-8 flex items-center'>
              <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>边角大小</span>
              <ul className='w-full flex items-center justify-around'>
                <li style={{ width: 30 }}>
                  <input
                    type="text"
                    className='w-full text-center border-none focus:outline-none'
                    {...register('borderTopLeftRadius', { value: borderTopLeftRadius || 0 })}
                  />
                </li>
                <li style={{ width: 30 }}>
                  <input
                    type="text"
                    className='w-full text-center border-none focus:outline-none'
                    {...register('borderTopRightRadius', { value: borderTopRightRadius || 0 })}
                  />
                </li>
                <li style={{ width: 30 }}>
                  <input
                    type="text"
                    className='w-full text-center border-none focus:outline-none'
                    {...register('borderBottomRightRadius', {
                      value: borderBottomRightRadius || 0,
                    })}
                  />
                </li>
                <li style={{ width: 30 }}>
                  <input
                    type="text"
                    className='w-full text-center border-none focus:outline-none'
                    {...register('borderBottomLeftRadius', { value: borderBottomLeftRadius || 0 })}
                  />
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BorderConfig;
