import React from 'react';

import MarginBPadding from './margin-b-padding';

interface Props {
  register: any;
  initValues: Record<string, string | number>;
}

function LayoutConfig({ register, initValues }: Props): JSX.Element {
  return (
    <>
      <div className='p-8 border border-gray-300 rounded-4'>
        <div className='flex items-center justify-between'>
          <div className='w-1/2 flex items-center'>
            <span className='text-12 text-gray-400'>宽度</span>
            <input
              type="text"
              className='px-8 border-none focus:outline-none'
              style={{ width: 46 }}
              {...register('width', { value: initValues.width || 0 })}
            />
            <span className='ml-4 text-12 text-gray-400'>px</span>
          </div>
          <div className='w-1/2 flex items-center'>
            <span className='text-12 text-gray-400'>高度</span>
            <input
              type="text"
              className='px-8 border-none focus:outline-none'
              style={{ width: 46 }}
              {...register('height', { value: initValues.height || 0 })}
            />
            <span className='ml-4 text-12 text-gray-400'>px</span>
          </div>
          {/* <Icon name="link" color='gray' /> */}
          <span className='text-12 cursor-pointer'>比例</span>
        </div>
      </div>
      <div className='mt-8'>
        <MarginBPadding
          classNames='border border-dashed border-gray-400 bg-blue-200 rounded-4'
          title="margin"
          showIcon
          register={register}
          initValues={initValues}
          keywords={['marginTop', 'marginLeft', 'marginRight', 'marginBottom']}
        >
          <MarginBPadding
            classNames='w-full border border-dashed border-gray-400'
            title="padding"
            styles={{ height: 98, backgroundColor: '#F0FDF4' }}
            register={register}
            initValues={initValues}
            keywords={['paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom']}
          >
            <div
              className='w-full h-full bg-blue-200 text-12 text-center text-gray-400'
              style={{ height: 42, lineHeight: '42px' }}>
                1440 X 900
            </div>
          </MarginBPadding>
        </MarginBPadding>
      </div>
    </>
  );
}

export default LayoutConfig;
