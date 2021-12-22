import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { ColorResult } from 'react-color';

import { RadioButtonGroup, Icon, ColorPicker } from '@ofa/ui';

const { formatRgba }: any = ColorPicker;

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

  useEffect(() => {
    const { backgroundColor, backgroundImage } = initValues;
    if (backgroundColor !== 'transparent') {
      setFillStatus('color');
      return;
    }

    if (backgroundImage && ((backgroundImage as string).indexOf('url') >= 0)) {
      setFillStatus('img');
      return;
    }
  }, [initValues]);

  function handleRadioChange(value: string | number | boolean): void {
    const _value = value as string;
    if (fillStatus === _value) return;
    if (_value === 'none') {
      setValue('backgroundColor', 'transparent');
      setValue('backgroundImage', 'none');
    }
    if (_value === 'color') {
      setValue('backgroundColor', 'rgba(255, 255, 255, 1)');
      setValue('backgroundImage', 'none');
    }
    if (_value === 'img') {
      setValue('backgroundColor', 'transparent');
      setValue('backgroundImage', '');
      setValue('backgroundSize', '100%');
    }
    setFillStatus(_value);
  }

  function handleColorChange(color: ColorResult): void {
    const { rgb } = color;
    const _color = formatRgba(rgb);
    setValue('backgroundColor', _color);
    onFormChange();
  }

  function handleImageUrl(url: string): string {
    let _url = '';

    if (url.indexOf('url') === 0) {
      _url = url.substring(4, url.length - 1);
    }

    if (url === 'none') {
      return _url;
    }

    return _url;
  }

  return (
    <div>
      <div className='text-12 text-gray-600'>填充类型</div>
      <RadioButtonGroup
        listData={FILL_LIST as []}
        onChange={(val) => handleRadioChange(val + '')}
        currentValue={fillStatus}
      />
      <input type="hidden" {...register('backgroundColor', {
        value: initValues.backgroundColor || 'transparent',
      })} />
      {fillStatus !== 'img' && (
        <input type="hidden" {...register('backgroundImage', { value: initValues.backgroundImage || '' })} />
      )}
      {fillStatus === 'color' && (
        <div className='mt-8 px-8 py-6 border border-gray-300 rounded-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex items-center justify-between'>
              <ColorPicker
                value={initValues.backgroundColor as string}
                onChange={handleColorChange}
              />
              <span className='ml-8 text-12 text-gray-900'>
                {initValues.backgroundColor}
              </span>
            </div>
            {/* <div className='mx-8 w-1 h-20 border-left bg-gray-200'></div>
            <div className='relative'>
              <input style={{ width: 40 }} type="number" value={100} />
              <span className='absolute right-2 top-1'>%</span>
            </div> */}
          </div>
          {/* <Icon name="remove_red_eye" color="gray" /> */}
        </div>
      )}
      {fillStatus === 'img' && (
        <div className='mt-8'>
          <div className='text-12 text-gray-600'>图片地址</div>
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
              className='mr-8 px-8 py-6 w-full border border-gray-300 corner-2-8-8-8'
              {...register('backgroundImage', {
                value: handleImageUrl((initValues.backgroundImage as string) || ''),
              })}
            />
            <Icon name='code' color='gray' />
          </div>
        </div>
      )}
    </div>
  );
}

export default BackgroundConfig;
