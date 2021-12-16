import React from 'react';
import cs from 'classnames';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import { Icon } from '@ofa/ui';

interface Props {
  classNames?: string;
  styles?: React.CSSProperties;
  title?: string;
  showIcon?: boolean;
  children?: JSX.Element;
  register: UseFormRegister<FieldValues>;
  initValues: Record<string, string | number>;
  keywords: string[];
}

function MarginBPadding({ classNames, title, showIcon, children,
  styles, register, keywords, initValues }: Props): JSX.Element {
  // function handleValueChange(e: any): void {
  //   console.log('e', e.target.value);
  // }

  return (
    <div
      className={cs('px-4', classNames)}
      style={styles}
    >
      <div className='h-32 flex items-center justify-center relative'>
        <span className='absolute left-0 text-12 text-gray-400'>{title}</span>
        <input
          type="text"
          className='bg-transparent text-center focus:outline-none'
          style={{ backgroundColor: 'transparent' }}
          {...register(keywords[0], { value: initValues[keywords[0]] })}
        />
        {showIcon && <Icon className='absolute right-0 cursor-pointer' name='link' color='gray' />}
      </div>
      <div className='flex items-center '>
        <div className='w-32'>
          <input
            type="text"
            className='w-full bg-transparent text-center focus:outline-none'
            style={{ backgroundColor: 'transparent' }}
            {...register(keywords[1], { value: initValues[keywords[1]] })}
          />
        </div>
        {children}
        <div className='w-32'>
          <input
            type="text"
            className='w-full bg-transparent text-center focus:outline-none'
            style={{ backgroundColor: 'transparent' }}
            {...register(keywords[2], { value: initValues[keywords[0]] })}
          />
        </div>
      </div>
      <div className='h-28 flex items-center justify-center'>
        <input
          type="text"
          className='bg-transparent text-center focus:outline-none'
          style={{ backgroundColor: 'transparent' }}
          {...register(keywords[3], { value: initValues[keywords[0]] })}
        />
      </div>
    </div>
  );
}

export default MarginBPadding;
