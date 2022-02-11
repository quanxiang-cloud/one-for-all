import React, { useEffect, useState } from 'react';
import { defaults, noop } from 'lodash';

import { useCtx, DataBind as ConfigBind } from '../../../index';
import { Select, Icon, Button, Toggle } from '@one-for-all/ui';

type Callback=(...args: any[])=> void;

export interface Props {
  title: string;
  isOpen: boolean;
  id?: string;
  // onClose moved into event panel
  onClose?: Callback;
  onCancel?: Callback;
  onConfirm?: Callback;
  className?: string;
  width?: number | string;
  height?: number | string;
  fullscreen?: boolean;
}

export const defaultConfig: Props={
  title: 'modal 标题',
  isOpen: true,
  width: 'auto',
  height: 'auto',
  fullscreen: false,
}

function ConfigForm(props: Props): JSX.Element {
  const {page}=useCtx()
  const [values, setValues] = useState<Props>(defaults(page.activeElemProps, defaultConfig));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, name: string): void{
    setValues({ ...values, [name]: e.target.value })
  }

  return (
    <>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>ID</label>
        <div className='flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.id}
            onChange={(e) => handleChange(e, 'id')}
          />
          <ConfigBind name='id' />
        </div>
      </div>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>标题</label>
        <div className='flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.title}
            onChange={(e) => handleChange(e, 'title')}
          />
          <ConfigBind name='title' />
        </div>
      </div>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>宽度</label>
        <div className='flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.width}
            onChange={(e) => handleChange(e, 'width')}
          />
          <ConfigBind name='width' />
        </div>
      </div>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>高度</label>
        <div className='flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.height}
            onChange={(e) => handleChange(e, 'height')}
          />
          <ConfigBind name='height' />
        </div>
      </div>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>是否全屏</label>
        <div className='flex items-center justify-between'>
          <Toggle defaultChecked={values.fullscreen} onChange={(fullscreen)=>  setValues({ ...values, fullscreen })}/>
          <ConfigBind name='fullscreen' />
        </div>
      </div>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>显示对话框</label>
        <div className='flex items-center justify-between'>
          <Toggle defaultChecked={values.isOpen} onChange={(isOpen)=>  setValues({ ...values, isOpen })}/>
          <ConfigBind name='isOpen' />
        </div>
      </div>
    </>
  );
}

export default ConfigForm;
