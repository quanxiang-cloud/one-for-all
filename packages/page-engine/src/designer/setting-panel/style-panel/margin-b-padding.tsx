import React, { useState } from 'react';
import cs from 'classnames';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import { Icon } from '@one-for-all/ui';

interface Props {
  classNames?: string;
  styles?: React.CSSProperties;
  title?: string;
  children?: JSX.Element;
  register: UseFormRegister<FieldValues>;
  initValues: Record<string, string | number>;
  keywords: string[];
  setKey?: 'margin' | 'padding';
  setValue: (key: string, val: string | number) => void;
}

function MarginBPadding({ classNames, title, children, setValue,
  styles, register, keywords, initValues, setKey = 'margin' }: Props): JSX.Element {
  const [oldValue, setOldValue] = useState(handleInitData(initValues));

  const [locking, setLocking] = useState(false);

  function handleLocking(): void {
    const _isLock = !locking;
    setLocking(_isLock);
  }

  function handleInitData(values: Record<string, string | number>): Record<string, string | number> {
    if (setKey === 'margin') {
      return {
        marginTop: values.marginTop || 0,
        marginRight: values.marginRight || 0,
        marginBottom: values.marginBottom || 0,
        marginLeft: values.marginLeft || 0,
      };
    }
    return {
      paddingTop: values.paddingTop || 0,
      paddingRight: values.paddingRight || 0,
      paddingBottom: values.paddingBottom || 0,
      paddingLeft: values.paddingLeft || 0,
    };
  }

  function handleBlur(e: React.ChangeEvent<HTMLInputElement>, key: string): void {
    const newValue = Number(e.target.value) || 1;
    const oldVal = Number(oldValue[key]) || 0;
    const newStyle: Record<string, string | number> = {};
    if (!locking) {
      setOldValue({
        ...oldValue,
        [key]: newValue,
      });
      return;
    }

    if (oldVal === 0) {
      const newStyle: Record<string, string | number> = {};
      const short = Number(newValue - oldVal);
      keywords.filter((item) => item !== key).map((item) => {
        newStyle[item] = parseFloat(((Number(oldValue[item]) || 0) + short).toString());
        setValue(item, newStyle[item]);
      });
      setOldValue({
        [key]: newValue,
        ...newStyle,
      });
      return;
    }

    const scale = Number((oldVal / newValue).toFixed(2));
    keywords.filter((item) => item !== key).map((item) => {
      newStyle[item] = parseFloat(((Number(oldValue[item]) || 0) / scale).toString());
      setValue(item, newStyle[item]);
    });
    setOldValue({
      [key]: newValue,
      ...newStyle,
    });
  }

  return (
    <div
      className={cs('px-4', classNames)}
      style={styles}
    >
      <div className='h-28 flex items-center justify-center relative'>
        <span className='absolute left-0 text-12 text-gray-400'>{title}</span>
        <input
          type="text"
          className='input-number bg-transparent text-center focus:outline-none'
          style={{ backgroundColor: 'transparent' }}
          placeholder='0'
          {...register(keywords[0], {
            value: initValues[keywords[0]] || '',
            onBlur: (e) => handleBlur(e, keywords[0]),
          })}
        />
        <Icon
          className='absolute right-0 cursor-pointer'
          name='link'
          color={locking ? 'blue' : 'gray'}
          onClick={handleLocking}
        />
      </div>
      <div className='flex items-center '>
        <div className='w-32'>
          <input
            type="text"
            className='w-full bg-transparent text-center focus:outline-none'
            style={{ backgroundColor: 'transparent' }}
            placeholder='0'
            {...register(keywords[1], {
              value: initValues[keywords[1]] || '',
              onBlur: (e) => handleBlur(e, keywords[1]),
            })}
          />
        </div>
        {children}
        <div className='w-32'>
          <input
            type="text"
            className='w-full bg-transparent text-center focus:outline-none'
            style={{ backgroundColor: 'transparent' }}
            placeholder='0'
            {...register(keywords[2], {
              value: initValues[keywords[2]] || '',
              onBlur: (e) => handleBlur(e, keywords[2]),
            })}
          />
        </div>
      </div>
      <div className='h-28 flex items-center justify-center'>
        <input
          type="text"
          className='bg-transparent text-center focus:outline-none'
          style={{ backgroundColor: 'transparent' }}
          placeholder='0'
          {...register(keywords[3], {
            value: initValues[keywords[3]] || '',
            onBlur: (e) => handleBlur(e, keywords[3]),
          })}
        />
      </div>
    </div>
  );
}

export default MarginBPadding;
