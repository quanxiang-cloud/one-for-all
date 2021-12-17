import React, { useState } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import { RadioButtonGroup, Icon, ColorPicker } from '@ofa/ui';

const { stringRgbToHex }: any = ColorPicker;

type LabelValue = {
  label: string;
  value: string;
}

const FILL_LIST: LabelValue[] = [
  { value: 'none', label: '无' },
  { value: 'color', label: '颜色填充' },
  { value: 'img', label: '图片填充' },
];

interface Props {
  initValues: Record<string, string | number>;
  register: UseFormRegister<FieldValues>;
  setValue: any;
  onFormChange: () => void;
}

function BackgroundConfig({ initValues, register, setValue, onFormChange }: Props): JSX.Element {
  const [fillStatus, setFillStatus] = useState('none');

  function handleRadioChange(value: string): void {
    console.log('value', value);
    if (fillStatus === value) return;
    if (value === 'none') {
      setValue('backgroundColor', 'transparent');
      setValue('backgroundImage', 'none');
    }
    if (value === 'color') {
      setValue('backgroundColor', 'rgba(255, 255, 255, 1)');
      setValue('backgroundImage', 'none');
    }
    if (value === 'img') {
      setValue('backgroundColor', 'transparent');
      // setValue('backgroundImage', 'none');
    }
    setFillStatus(value);
    onFormChange();
  }

  function handleColorChange(color: string): void {
    setValue('backgroundColor', color);
    onFormChange();
  }

  return (
    <div>
      <div className='text-12 text-gray-600'>填充类型</div>
      <RadioButtonGroup
        listData={FILL_LIST as []}
        onChange={handleRadioChange}
        currentValue={fillStatus}
      />
      {fillStatus === 'color' && (
        <div className='mt-8 px-8 py-6 border border-gray-300 rounded-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex items-center justify-between'>
              {/* <input
                style={{ width: 20, height: 24, padding: 0, backgroundColor: 'transparent' }}
                type="color"
                {...register('backgroundColor', { value: initValues.backgroundColor || '' })}
              />
              <span className='ml-8 text-12 text-gray-900'>{initValues.backgroundColor}</span> */}
              <input
                style={{ width: 20, height: 24, padding: 0, backgroundColor: 'transparent' }}
                type="hidden"
                {...register('backgroundColor', { value: initValues.backgroundColor || '' })}
              />
              <ColorPicker
                opacity={true}
                value={initValues.color as string}
                onChange={handleColorChange}
              />
              <span className='ml-8 text-12 text-gray-900'>
                {stringRgbToHex(initValues.color)}
              </span>
            </div>
            {/* <div className='mx-8 w-1 h-20 border-left bg-gray-200'></div>
            <div className='relative'>
              <input style={{ width: 40 }} type="number" value={100} />
              <span className='absolute right-2 top-1'>%</span>
            </div> */}
          </div>
          <Icon name="remove_red_eye" color="gray" />
        </div>
      )}
      {fillStatus === 'img' && (
        <div className='mt-8'>
          <div className='text-12 text-gray-600'>图片填充</div>
          <div className='flex items-center justify-between'>
            {/* <label
              htmlFor='inputUpload'
              className='mr-8 px-8 py-6 w-full border border-gray-300 rounded-4 flex items-center'
            >
              <Icon name='photo' color='gray' />
              <span className='text-12 text-gray-400'>点击上传图片</span>
              <input
                id='inputUpload'
                type="file"
                className='hidden'
                {...register('backgroundImage', { value: initValues.backgroundImage || '' })}
              />
            </label> */}
            <input
              type="text"
              className='px-8 py-6 w-full border border-gray-300 corner-2-8-8-8'
              {...register('backgroundImage', { value: initValues.backgroundImage || '' })}
            />

            <Icon name='code' color='gray' />
          </div>
        </div>
      )}
    </div>
  );
}

export default BackgroundConfig;
