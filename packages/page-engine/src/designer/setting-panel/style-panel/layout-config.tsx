import React, { useState } from 'react';
import { UseFormRegister, FieldValues, UseFormSetValue } from 'react-hook-form';

import { Icon } from '@ofa/ui';

import MarginBPadding from './margin-b-padding';

interface Props {
  register: UseFormRegister<FieldValues>;
  initValues: Record<string, string | number>;
  setValue: UseFormSetValue<FieldValues>;
}

function LayoutConfig({ register, initValues, setValue }: Props): JSX.Element {
  const [oldValue, setOldValue] = useState({
    width: initValues.width || 0,
    height: initValues.height || 0,
  });
  const [locking, setLocking] = useState(false);

  function handleLocking(): void {
    const _isLock = !locking;
    setLocking(_isLock);
  }

  function handleBlur(e: React.ChangeEvent<HTMLInputElement>, key: string): void {
    const newValue = Number(e.target.value) || 1;
    if (!locking) {
      setOldValue({
        ...oldValue,
        [key]: newValue,
      });
      return;
    }
    if (key === 'width') {
      const oldWidth = Number(oldValue.width) || 1;
      const oldHeight = Number(oldValue.height) || 1;
      const scale = Number((oldWidth / newValue).toFixed(2));
      const result = oldHeight / scale;
      const newHeight = parseFloat(result.toString());
      setValue('height', newHeight);
      setOldValue({
        width: newValue,
        height: newHeight,
      });
    } else {
      const oldWidth = Number(oldValue.width) || 1;
      const oldHeight = Number(oldValue.height) || 1;
      const scale = Number((oldHeight / newValue).toFixed(2));
      const result = oldWidth / scale;
      const newWidth = parseFloat(result.toString());
      setValue('width', newWidth);
      setOldValue({
        width: newWidth,
        height: oldHeight,
      });
    }
  }

  return (
    <>
      <div className='p-8 border border-gray-300 rounded-4'>
        <div className='flex items-center justify-between'>
          <div className='w-1/2 flex items-center'>
            <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>宽度</span>
            <div className='relative' style={{ width: 50 }}>
              <input
                type="number"
                className='w-full border-none focus:outline-none'
                {...register('width', {
                  value: initValues.width || 0,
                  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => handleBlur(e, 'width'),
                })}
              />
              <span className='ml-4 w-16 absolute right-0 top-0 bg-white text-12 text-gray-400'>px</span>
            </div>
          </div>
          <div className='w-1/2 flex items-center'>
            <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>高度</span>
            <div className='relative' style={{ width: 50 }}>
              <input
                type="number"
                className='w-full border-none focus:outline-none'
                {...register('height', {
                  value: initValues.height || 0,
                  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => handleBlur(e, 'height'),
                })}
              />
              <span className='ml-4 w-16 absolute right-0 top-0 bg-white text-12 text-gray-400'>px</span>
            </div>
          </div>
          <Icon
            name="link"
            className='cursor-pointer'
            color={locking ? 'blue' : 'gray'}
            onClick={handleLocking}
          />
        </div>
      </div>
      <div className='mt-8'>
        <MarginBPadding
          classNames='border border-dashed border-gray-400 bg-blue-200 rounded-4'
          title="margin"
          register={register}
          initValues={initValues}
          setKey='margin'
          setValue={setValue}
          keywords={['marginTop', 'marginLeft', 'marginRight', 'marginBottom']}
        >
          <MarginBPadding
            classNames='w-full border border-dashed border-gray-400'
            title="padding"
            styles={{ height: 98, backgroundColor: '#F0FDF4' }}
            register={register}
            initValues={initValues}
            setKey='padding'
            setValue={setValue}
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
