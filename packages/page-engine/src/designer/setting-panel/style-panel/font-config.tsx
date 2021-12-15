import React from 'react';
import { UseFormRegister, FieldValues, Controller } from 'react-hook-form';

import { ColorPicker } from '@ofa/ui';
// import ColorPicker from './form-color-picker';

interface Props {
  initValues: Record<string, string | number>;
  register: UseFormRegister<FieldValues>;
  control: any;
  setValue: any;
}

function FontConfig({ initValues, register, control, setValue }: Props): JSX.Element {
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
            type="text"
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
        <div className='ml-8 flex items-center'>
          {/* <input
            type="color"
            style={{ width: 20, height: 24, padding: 0, backgroundColor: 'transparent' }}
            {...register('color', { value: initValues.color || '#ffffff' })}
          /> */}
          sdfddf
          {/* <ColorPicker control={control} /> */}
          {/* <ColorPicker {...register('color', { value: initValues.color || '#ffffff' })} /> */}
          <Controller
            defaultValue={''}
            name="color"
            control={control}
            render={({ field }) => {
              // const { value } = field;
              return <ColorPicker {...field} />;
              // return <input {...field} />;
            }}
          />
          <span className='ml-8 text-12 text-gray-900'>{initValues.color}</span>
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
