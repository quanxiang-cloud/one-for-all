import React from 'react';

function ShadowConfig(): JSX.Element {
  return (
    <div className='mt-8 py-8 border border-gray-300 rounded-4'>
      <div className='mb-8 flex items-center justify-content'>
        <div className='w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>X轴</span>
          <input className='w-full' type="text" />
        </div>
        <div className='mr-8 w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>Y轴</span>
          <input className='w-full' type="text" />
        </div>
      </div>
      <div className='mb-8 flex items-center justify-content'>
        <div className='w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>模糊</span>
          <input className='w-full' type="text" />
        </div>
        <div className='mr-8 w-2/4 flex items-center'>
          <span className='px-8 text-12 text-gray-400 whitespace-nowrap'>扩展</span>
          <input className='w-full' type="text" />
        </div>
      </div>
      <div className='flex items-center'>
        <div className='ml-8 flex items-center'>
          <input
            style={{ width: 20, height: 24, padding: 0, backgroundColor: 'transparent' }}
            type="color"
          />
          <span className='ml-8 text-12 text-gray-900'>000000</span>
        </div>
        <div className='mx-8 w-1 h-20 border-left bg-gray-200'></div>
        <div className='relative'>
          <input style={{ width: 40 }} type="number" value={100} />
          <span className='absolute right-2 top-1'>%</span>
        </div>
      </div>
    </div>
  );
}

export default ShadowConfig;
