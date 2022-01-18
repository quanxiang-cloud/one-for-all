import React, { useEffect, useState } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { ColorResult } from 'react-color';
import cs from 'classnames';

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

const REPEAT_LIST: LabelValue[] = [
  { value: 'repeat', label: 're' },
  { value: 'repeat-x', label: 're-x' },
  { value: 'repeat-y', label: 're-y' },
  { value: 'no-repeat', label: 'no-re' },
];

const ATTACHMENT_LIST: LabelValue[] = [
  { value: 'fixed', label: 'fixed' },
  { value: 'scroll', label: 'scroll' },
];

const POSITION_VALUES: Record<string, string> = {
  leftTop: '0% 0%',
  centerTop: '50% 0%',
  rightTop: '100% 0%',
  leftCenter: '0% 50%',
  center: '50% 50%',
  rightCenter: '100% 50%',
  leftBottom: '0% 100%',
  centerBottom: '50% 100%',
  rightBottom: '100% 100%',
};

interface Props {
  initValues: Record<string, string | number>;
  register: UseFormRegister<FieldValues>;
  setValue: any;
  onFormChange: () => void;
}

function BackgroundConfig({ initValues, register, setValue, onFormChange }: Props): JSX.Element {
  const [fillStatus, setFillStatus] = useState('none');
  const [repeatStatus, setRepeatStatus] = useState('repeat');
  const [attachmentStatus, setAttachmentStatus] = useState('scroll');
  const [positionValue, setPositionValue] = useState({
    x: '',
    y: '',
  });
  const [sizeValue, setSizeValue] = useState<any>('');
  const { backgroundColor, backgroundImage, backgroundPosition,
    backgroundSize, backgroundRepeat, backgroundAttachment } = initValues;

  useEffect(() => {
    if (backgroundImage && !backgroundColor) {
      setFillStatus('img');
    }

    if (backgroundColor && !backgroundImage) {
      setFillStatus('color');
    }

    if (!backgroundColor && !backgroundImage) {
      setFillStatus('none');
    }

    if (backgroundPosition) {
      const placeArray: string[] = (backgroundPosition as string).split(' ');
      const valueArray: string[] = [];
      placeArray.map((item) => {
        valueArray.push(item.substring(0, item.length - 1));
      });
      const [x = '', y = ''] = valueArray;
      setPositionValue({ x, y });
    }

    if (backgroundSize) {
      if (['cover', 'contain'].includes(backgroundSize as string)) {
        setSizeValue(backgroundSize);
      } else {
        const placeArray: string[] = (backgroundSize as string).split(' ');
        const valueArray: string[] = [];
        placeArray.map((item) => {
          valueArray.push(item.substring(0, item.length - 1));
        });
        const [x = '', y = ''] = valueArray;
        setSizeValue({ x, y });
      }
    }

    if (backgroundRepeat) {
      setRepeatStatus(backgroundRepeat as string);
    }

    if (backgroundAttachment) {
      setAttachmentStatus(backgroundAttachment as string);
    }
  }, [backgroundColor, backgroundImage, backgroundPosition,
    backgroundSize, backgroundRepeat, backgroundAttachment]);

  function handleRadioChange(value: string | number | boolean): void {
    const _value = value as string;
    if (fillStatus === _value) return;
    if (_value === 'none') {
      setValue('backgroundColor', '');
      setValue('backgroundImage', '');
    }
    if (_value === 'color') {
      setValue('backgroundImage', '');
    }
    if (_value === 'img') {
      setValue('backgroundColor', '');
    }
    setFillStatus(_value);
  }

  function handleColorChange(color: ColorResult): void {
    const { rgb } = color;
    const _color = formatRgba(rgb);
    setValue('backgroundColor', _color);
    onFormChange();
  }

  function handleRepeatChange(value: string | number | boolean): void {
    const _value = value as string;
    setValue('backgroundRepeat', _value);
    setRepeatStatus(_value);
    onFormChange();
  }

  function handleAttachmentChange(value: string | number | boolean): void {
    const _value = value as string;
    setValue('backgroundAttachment', _value);
    setAttachmentStatus(_value);
    onFormChange();
  }

  function handlePosition(place: string): void {
    const placeArray = place.split(' ');
    const valueArray: string[] = [];
    placeArray.map((item) => {
      valueArray.push(item.substring(0, item.length - 1));
    });
    const [x = '', y = ''] = valueArray;
    setPositionValue({
      x,
      y,
    });
    setValue('backgroundPosition', place);
  }

  function handlePositionChange(e: React.ChangeEvent<HTMLInputElement>, place: 'x' | 'y'): void {
    const newValue = {
      ...positionValue,
      [place]: e.target.value,
    };
    setPositionValue(newValue);
    const { x, y } = newValue;
    setValue('backgroundPosition', `${x}% ${y}%`);
  }

  function handleComputedChecked(): string {
    const { x, y } = positionValue;
    const _string = `${x}% ${y}%`;
    let _checkedValue = '';
    Object.entries(POSITION_VALUES).forEach((item) => {
      const [key, value] = item;
      if (value === _string) {
        _checkedValue = key;
      }
    });
    return _checkedValue;
  }

  function handleSizeChange(value: 'cover' | 'contain'): void {
    setSizeValue(value);
    setValue('backgroundSize', value);
    onFormChange();
  }

  function handleSizeInputChange(e: React.ChangeEvent<HTMLInputElement>, place: 'x' | 'y'): void {
    const _value = e.target.value;
    const { x = '', y = '' } = sizeValue;
    const newValue = {
      x,
      y,
      [place]: _value,
    };
    setSizeValue(newValue);
    const _sizeValue = `${newValue.x}% ${newValue.y}%`;
    setValue('backgroundSize', _sizeValue);
    onFormChange();
  }

  const checkedValue = handleComputedChecked();

  return (
    <div>
      <div className='text-12 text-gray-600'>填充类型</div>
      <RadioButtonGroup
        listData={FILL_LIST as []}
        onChange={(val) => handleRadioChange(val)}
        currentValue={fillStatus}
      />
      <input type="hidden" {...register('backgroundColor', {
        value: backgroundColor || '',
      })} />
      <input type="hidden" {...register('backgroundImage', { value: backgroundImage || '' })} />
      {fillStatus === 'color' && (
        <div className='mt-8 px-8 py-6 border border-gray-300 rounded-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex items-center justify-between'>
              <ColorPicker
                value={backgroundColor as string}
                onChange={handleColorChange}
              />
              <span className='ml-8 text-12 text-gray-900'>
                {backgroundColor}
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
        <>
          <input type="hidden" {...register('backgroundPosition', { value: backgroundPosition || '' })} />
          <input type="hidden" {...register('backgroundSize', { value: backgroundSize || '' })} />
          <input type="hidden" {...register('backgroundRepeat', { value: backgroundRepeat || '' })} />
          <input type="hidden" {...register('backgroundAttachment', { value: backgroundAttachment || '' })} />
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
                  value: backgroundImage || '',
                })}
              />
              <Icon name='code' color='gray' />
            </div>
          </div>
          <div className='mt-8'>
            <div className='text-12 text-gray-600'>定位</div>
            <div className='p-4 flex items-center justify-between border border-gray-300 rounded-4'>
              <div className='relative' style={{ width: 70, height: 70 }}>
                <span
                  className={cs('p-2 absolute top-0 left-0 cursor-pointer',
                    { 'bg-gray-300': checkedValue === 'leftTop' })}
                  onClick={() => handlePosition(POSITION_VALUES['leftTop'])}
                >
                  <Icon name="code" color='gray' />
                </span>
                <span
                  className={cs('p-2 absolute top-0 left-2/4 -ml-10 cursor-pointer',
                    { 'bg-gray-300': checkedValue === 'centerTop' })}
                  onClick={() => handlePosition(POSITION_VALUES['centerTop'])}
                >
                  <Icon name="code" color='gray' />
                </span>
                <span
                  className={cs('p-2 absolute top-0 right-0 cursor-pointer',
                    { 'bg-gray-300': checkedValue === 'rightTop' })}
                  onClick={() => handlePosition(POSITION_VALUES['rightTop'])}
                >
                  <Icon name="code" color='gray' />
                </span>
                <span
                  className={cs('p-2 absolute top-2/4 left-0 -mt-10 cursor-pointer',
                    { 'bg-gray-300': checkedValue === 'leftCenter' })}
                  onClick={() => handlePosition(POSITION_VALUES['leftCenter'])}
                >
                  <Icon name="code" color='gray' />
                </span>
                <span
                  className={cs('p-2 absolute top-2/4 left-2/4 -mt-10 -ml-10',
                    { 'bg-gray-300': checkedValue === 'center' })}
                  onClick={() => handlePosition(POSITION_VALUES['center'])}
                >
                  <Icon name="code" color='gray' />
                </span>
                <span
                  className={cs('p-2 absolute top-2/4 right-0 -mt-10 cursor-pointer',
                    { 'bg-gray-300': checkedValue === 'rightCenter' })}
                  onClick={() => handlePosition(POSITION_VALUES['rightCenter'])}
                >
                  <Icon name="code" color='gray' />
                </span>
                <span
                  className={cs('p-2 absolute bottom-0 left-0 cursor-pointer',
                    { 'bg-gray-300': checkedValue === 'leftBottom' })}
                  onClick={() => handlePosition(POSITION_VALUES['leftBottom'])}
                >
                  <Icon name="code" color='gray'/>
                </span>
                <span
                  className={cs('p-2 absolute bottom-0 left-2/4 -ml-10 cursor-pointer',
                    { 'bg-gray-300': checkedValue === 'centerBottom' })}
                  onClick={() => handlePosition(POSITION_VALUES['centerBottom'])}
                >
                  <Icon name="code" color='gray' />
                </span>
                <span
                  className={cs('p-2 absolute bottom-0 right-0 cursor-pointer',
                    { 'bg-gray-300': checkedValue === 'rightBottom' })}
                  onClick={() => handlePosition(POSITION_VALUES['rightBottom'])}
                >
                  <Icon name="code" color='gray' />
                </span>
              </div>
              <div className='ml-10 flex flex-col'>
                <div className='flex items-center'>
                  <Icon name="code" color="gray" className='mr-8' />
                  <div className='relative '>
                    <input
                      type="number"
                      placeholder='0'
                      className='px-8 py-6 w-full border border-gray-300 corner-2-8-8-8'
                      value={positionValue.x}
                      onChange={(e) => handlePositionChange(e, 'x')}
                    />
                    <div className='px-4 absolute bg-gray-100 top-2
                    bottom-2 right-4 flex items-center'>%</div>
                  </div>
                </div>
                <div className='mt-4 flex items-center'>
                  <Icon name="code" color="gray" className='mr-8' />
                  <div className='relative '>
                    <input
                      type="number"
                      placeholder='0'
                      value={positionValue.y}
                      className='px-8 py-6 w-full border border-gray-300 corner-2-8-8-8'
                      onChange={(e) => handlePositionChange(e, 'y')}
                    />
                    <div className='px-4 absolute bg-gray-100 top-2
                    bottom-2 right-4 flex items-center'>%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-8'>
            <div className='text-12 text-gray-600'>大小</div>
            <div className='p-4 flex items-center justify-between border border-gray-300 rounded-4'>
              <div className='flex items-center whitespace-nowrap border border-gray-300 rounded-2'>
                <div
                  onClick={() => handleSizeChange('cover')}
                  className={cs('px-10 py-2 border-r border-gray-300 cursor-pointer',
                    { 'bg-gray-300': sizeValue === 'cover' })}>
                  <Icon name="code" color='gray' />
                </div>
                <div
                  onClick={() => handleSizeChange('contain')}
                  className={cs('px-10 py-2 cursor-pointer',
                    { 'bg-gray-300': sizeValue === 'contain' })}>
                  <Icon name="code" color='gray' />
                </div>
              </div>
              <div className='ml-10 flex flex-col'>
                <div className='flex items-center'>
                  <Icon name="code" color="gray" className='mr-8' />
                  <div className='relative '>
                    <input
                      type="number"
                      placeholder='auto'
                      className='px-8 py-6 w-full border border-gray-300 corner-2-8-8-8'
                      value={sizeValue.x || ''}
                      onChange={(e) => handleSizeInputChange(e, 'x')}
                    />
                    <div className='px-4 absolute bg-gray-100 top-2
                    bottom-2 right-4 flex items-center'>%</div>
                  </div>
                </div>
                <div className='mt-4 flex items-center'>
                  <Icon name="code" color="gray" className='mr-8' />
                  <div className='relative '>
                    <input
                      type="number"
                      placeholder='auto'
                      className='px-8 py-6 w-full border border-gray-300 corner-2-8-8-8'
                      value={sizeValue.y || ''}
                      onChange={(e) => handleSizeInputChange(e, 'y')}
                    />
                    <div className='px-4 absolute bg-gray-100 top-2
                    bottom-2 right-4 flex items-center'>%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-8'>
            <div className='text-12 text-gray-600'>平铺</div>
            <RadioButtonGroup
              listData={REPEAT_LIST as []}
              onChange={(val) => handleRepeatChange(val)}
              currentValue={repeatStatus}
            />
          </div>
          <div className='mt-8'>
            <div className='text-12 text-gray-600'>固定</div>
            <RadioButtonGroup
              listData={ATTACHMENT_LIST as []}
              onChange={(val) => handleAttachmentChange(val)}
              currentValue={attachmentStatus}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default BackgroundConfig;
