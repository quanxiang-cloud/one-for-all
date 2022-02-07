import React, { useState } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { ColorResult } from 'react-color';

import { ColorPicker } from '@one-for-all/ui';

const { formatRgba }: any = ColorPicker;

type SHADOW_CONFIG = {
  color: string;
  x: string | number;
  y: string | number;
  blur: string | number;
  spread: string | number;
}
interface Props {
  initValues: Record<string, string | number>;
  register: UseFormRegister<FieldValues>;
  setValue: (key: string, val: string | number) => void;
  onFormChange: () => void;
}

function ShadowConfig({ initValues, setValue, onFormChange }: Props): JSX.Element {
  const [shadowValues, setShowValues] = useState(handleInitData((initValues.boxShadow || '') as string));

  function handleInitData(init: string): SHADOW_CONFIG {
    const _config = {
      color: 'rgba(0, 0, 0, 1)',
      x: '',
      y: '',
      blur: '',
      spread: '',
    };

    if (init === 'none') {
      return _config;
    }

    return _config;
  }

  function formatShadow(val: SHADOW_CONFIG): void {
    let _config = '';
    const { color, x, y, blur, spread } = val;
    if (color) {
      _config = _config + color;
    }

    if (x) {
      _config = _config + ` ${Number(x) || 0}px`;
    }
    if (y) {
      _config = _config + ` ${Number(y) || 0}px`;
    }

    if (!x || !y) return;

    if (blur) {
      _config = _config + ` ${Number(blur) || 0}px`;
    }
    if (spread) {
      _config = _config + ` ${Number(spread) || 0}px`;
    }

    setValue('boxShadow', _config);
    onFormChange();
  }

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>, key: string): void {
    const newValue = {
      ...shadowValues,
      [key]: e.target.value,
    };
    setShowValues(newValue);
    formatShadow(newValue);
  }

  function handleColorChange(color: ColorResult): void {
    const { rgb } = color;
    const _color = formatRgba(rgb);
    const newValue = {
      ...shadowValues,
      color: _color,
    };
    setShowValues(newValue);
    formatShadow(newValue);
  }

  return (
    <div className='mt-8 py-8 border border-gray-300 rounded-4'>
      <div className='mb-8 flex items-center justify-content'>
        <div className='w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>X轴</span>
          <input
            className='w-full focus:outline-none'
            type="text"
            placeholder='0'
            onChange={(e) => handleValueChange(e, 'x')}
          />
        </div>
        <div className='mr-8 w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>Y轴</span>
          <input
            className='w-full focus:outline-none'
            type="text"
            placeholder='0'
            onChange={(e) => handleValueChange(e, 'y')}
          />
        </div>
      </div>
      <div className='mb-8 flex items-center justify-content'>
        <div className='w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>模糊</span>
          <input
            className='w-full focus:outline-none'
            type="text"
            placeholder='0'
            onChange={(e) => handleValueChange(e, 'blur')}
          />
        </div>
        <div className='mr-8 w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>扩展</span>
          <input
            className='w-full focus:outline-none'
            type="text"
            placeholder='0'
            onChange={(e) => handleValueChange(e, 'spread')}
          />
        </div>
      </div>
      <div className='flex items-center'>
        <div className='ml-8 flex items-center'>
          <ColorPicker
            value={shadowValues.color}
            onChange={handleColorChange}
          />
          <span className='ml-8 text-12 text-gray-900'>
            {shadowValues.color}
          </span>
        </div>
        {/* <div className='mx-8 w-1 h-20 border-left bg-gray-200'></div>
        <div className='relative'>
          <input style={{ width: 40 }} type="number" value={100} />
          <span className='absolute right-2 top-1'>%</span>
        </div> */}
      </div>
    </div>
  );
}

export default ShadowConfig;
