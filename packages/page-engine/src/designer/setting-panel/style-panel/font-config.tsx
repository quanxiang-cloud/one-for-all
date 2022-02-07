import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { ColorResult } from 'react-color';

import { ColorPicker, Select } from '@one-for-all/ui';

const FONT_WEIGHT_OPTIONS: Record<'label' | 'value', string | number>[] = [
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: '300', value: 300 },
  { label: '400', value: 400 },
  { label: '500', value: 500 },
  { label: '600', value: 600 },
  { label: '700', value: 700 },
  { label: '800', value: 800 },
  { label: '900', value: 900 },
];

const TEXT_ALIGN_OPTIONS: Record<'label' | 'value', string | number>[] = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
  { label: 'justify', value: 'justify' },
];

interface Props {
  initValues: Record<string, string | number>;
  register: UseFormRegister<FieldValues>;
  setValue: (key: string, val: string | number) => void;
  onFormChange: () => void;
}

function FontConfig({ initValues, register, setValue, onFormChange }: Props): JSX.Element {
  const { fontSize, lineHeight, fontWeight, textAlign, color } = initValues;

  function handleColorChange(color: ColorResult): void {
    setValue('color', color.hex);
    onFormChange();
  }

  function handleFontWeightChange(value: string | number): void {
    setValue('fontWeight', value);
    onFormChange();
  }

  function handleTextAlignChange(value: string | number): void {
    setValue('textAlign', value);
    onFormChange();
  }

  return (
    <div className='mt-8 py-8 border border-gray-300 rounded-4'>
      <div className='mb-8 flex items-center justify-content'>
        <div className='w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>大小</span>
          <div className='relative flex' style={{ width: 50 }}>
            <input
              type="number"
              className='w-full focus:outline-none'
              {...register('fontSize', { value: fontSize || '' })}
            />
            <div className='w-20 absolute right-0 top-0 bg-white
              text-12 text-gray-400 cursor-pointer'>px</div>
          </div>
        </div>
        <div className='mr-8 w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>行高</span>
          <div className='relative flex' style={{ width: 50 }}>
            <input
              type="number"
              className='w-full focus:outline-none'
              {...register('lineHeight', { value: lineHeight || '' })}
            />
            <div className='w-20 absolute right-0 top-0 bg-white
              text-12 text-gray-400 cursor-pointer'>px</div>
          </div>
        </div>
      </div>
      <div className='mb-8 flex items-center justify-content'>
        <div className='w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>字重</span>
          <input
            type="hidden"
            className='w-full focus:outline-none'
            {...register('fontWeight', { value: fontWeight || 400 })}
          />
          <Select
            style={{ padding: 0, minWidth: 73 }}
            border={false}
            options={FONT_WEIGHT_OPTIONS}
            value={Number(fontWeight) || 400}
            onChange={handleFontWeightChange}
          />
        </div>
        <div className='mr-20 w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>对齐</span>
          <input type="hidden" {...register('textAlign', {
            value: textAlign || '',
          })} />
          <Select
            style={{ padding: 0, minWidth: 73 }}
            border={false}
            options={TEXT_ALIGN_OPTIONS}
            value={textAlign || 'left'}
            onChange={handleTextAlignChange}
          />
        </div>
      </div>
      <div className='flex items-center'>
        <div className='flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>颜色</span>
          <input readOnly type="hidden" {...register('color', {
            value: color || '',
          })} />
          <ColorPicker
            value={color as string || ''}
            onChange={handleColorChange}
          />
          <span className='ml-8 text-12 text-gray-900'>
            {color || ''}
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

export default FontConfig;
