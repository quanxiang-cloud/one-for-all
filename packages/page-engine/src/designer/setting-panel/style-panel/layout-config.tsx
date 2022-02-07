import React, { useState } from 'react';
import { UseFormRegister, FieldValues, UseFormSetValue } from 'react-hook-form';

import { Icon } from '@one-for-all/ui';

import MarginBPadding from './margin-b-padding';

interface Props {
  register: UseFormRegister<FieldValues>;
  initValues: Record<string, string | number>;
  setValue: UseFormSetValue<FieldValues>;
}

function LayoutConfig({ register, initValues, setValue }: Props): JSX.Element {
  const { width, widthUnit, height, heightUnit } = initValues;
  const [oldValue, setOldValue] = useState({
    width: Number(width) || 0,
    height: Number(height) || 0,
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

  function handleUnitChange(e: React.ChangeEvent<HTMLSelectElement>, key: string): void {
    const _value = e.target.value;
    setValue(`${key}Unit`, _value);
    if (_value === 'auto') {
      setValue(key, 'auto');
      return;
    }

    if (_value === '%') {
      setValue(key, '100');
      return;
    }

    if (_value === 'px') {
      setValue(key, '');
      return;
    }
  }

  return (
    <>
      <div className='p-8 border border-gray-300 rounded-4'>
        <div className='flex items-center justify-between'>
          <div className='w-1/2 flex items-center'>
            <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>宽度</span>
            <div className='relative flex' style={{ width: 50 }}>
              <input
                type={width === 'auto' ? 'hidden' : 'number'}
                disabled={width === 'auto'}
                min={0}
                className='w-full border-none focus:outline-none'
                style={{ background: 'none' }}
                {...register('width', {
                  value: width || '',
                  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => handleBlur(e, 'width'),
                })}
              />
              {width === 'auto' && (
                <span className='ml-4 w-16 bg-white text-12 text-gray-400'>{width}</span>
              )}
              <div className='ml-4 w-16 absolute right-0 top-0 bg-white text-12 text-gray-400'>
                <select onChange={(e) => handleUnitChange(e, 'width')} value={widthUnit || 'px'}>
                  <option label='px' value={'px'} />
                  <option label='%' value={'%'} />
                  <option label='auto' value={'auto'} />
                </select>
              </div>
            </div>
          </div>
          <div className='w-1/2 flex items-center'>
            <span className='mr-8 text-12 text-gray-400 whitespace-nowrap'>高度</span>
            <div className='relative' style={{ width: 50 }}>
              <input
                type={height === 'auto' ? 'hidden' : 'number'}
                disabled={height === 'auto'}
                className='w-full border-none focus:outline-none'
                style={{ background: 'none' }}
                // value={height || ''}
                {...register('height', {
                  value: height || '',
                  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => handleBlur(e, 'height'),
                })}
              />
              {height === 'auto' && (
                <span className='ml-4 w-16 bg-white text-12 text-gray-400'>{height}</span>
              )}
              <div className='ml-4 w-16 absolute right-0 top-0 bg-white text-12 text-gray-400'>
                <select onChange={(e) => handleUnitChange(e, 'height')} value={heightUnit || 'px'}>
                  <option>px</option>
                  <option>%</option>
                  <option>auto</option>
                </select>
              </div>
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
