import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import { ColorPicker } from '@ofa/ui';
// import ColorPicker from './form-color-picker';

const { stringRgbToHex }: any = ColorPicker;

interface Props {
  initValues: Record<string, string | number>;
  register: UseFormRegister<FieldValues>;
  control: any;
  setValue: any;
  onFormChange: () => void;
}

function FontConfig({ initValues, register, setValue, onFormChange }: Props): JSX.Element {
  // const [currColor, setCurrColor] = useState(initValues.color);
  function handleColorChange(color: string): void {
    setValue('color', color);
    onFormChange();
  }

  // console.log('当前颜色', initValues.color);

  return (
    <div className='mt-8 py-8 border border-gray-300 rounded-4'>
      <div className='mb-8 flex items-center justify-content'>
        <div className='w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>大小</span>
          <div className='relative flex' style={{ width: 50 }}>
            <input
              type="number"
              className='w-full focus:outline-none'
              {...register('fontSize', { value: initValues.fontSize || 0 })}
            />
            <div className='w-20 absolute right-0 top-0 bg-white
              text-12 text-gray-400 cursor-pointer'>px</div>
          </div>
        </div>
        <div className='mr-8 w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>行高</span>
          <input
            type="number"
            min={12}
            className='w-full focus:outline-none'
            {...register('lineHeight', { value: initValues.lineHeight || 20 })}
          />
        </div>
      </div>
      <div className='mb-8 flex items-center justify-content'>
        <div className='w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>字重</span>
          <input
            type="text"
            className='w-full focus:outline-none'
            {...register('fontWight', { value: initValues.fontWeight || 400 })}
          />
        </div>
        <div className='mr-8 w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>对齐</span>
          {/* <input className='w-full focus:outline-none' type="text" /> */}
        </div>
      </div>
      <div className='flex items-center'>
        <div className='flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>颜色</span>
          <input type="hidden" {...register('color')} />
          <ColorPicker
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
    </div>
  );
}

export default FontConfig;
