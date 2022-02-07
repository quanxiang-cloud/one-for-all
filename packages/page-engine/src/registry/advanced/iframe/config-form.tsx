import React, { useState, useEffect, HTMLAttributeReferrerPolicy } from 'react';
import { useForm } from 'react-hook-form';
import { defaults } from 'lodash';

import { useCtx, DataBind as ConfigBind } from '../../../index';

export interface IframeConfigProps {
  id?: string;
  sandbox?: string;
  iframeName?: string;
  iframeAddr?: string;
  iframeWidth?: string;
  iframeAllow?: string;
  iframeHeight?: string;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  allowFullscreen?: boolean;
  importance?: 'auto' | 'high' | 'low';
}

export const DEFAULT_CONFIG: IframeConfigProps = {
  sandbox: 'allow-scripts allow-same-origin allow-forms',
  iframeName: '',
  iframeAddr: '',
  iframeWidth: 'auto',
  iframeHeight: 'auto',
  allowFullscreen: false,
  importance: 'auto',
  referrerPolicy: '',
  iframeAllow: '',
};

function ConfigForm(): JSX.Element {
  const { register, getValues, reset } = useForm();
  const { page } = useCtx();
  const [values, setValues] = useState<IframeConfigProps>(defaults(page.activeElemProps, DEFAULT_CONFIG));

  function handleFormChange(): void {
    const _values = getValues();
    setValues(_values);
    page.updateElemProperty(page.activeElem.id, 'props', _values);
  }

  useEffect(() => {
    const _values = page.activeElemProps;
    reset(_values);
    setValues(_values);
  }, [page.activeElemId]);

  return (
    <div>
      <form
        className='flex flex-col gap-10'
        onChange={handleFormChange}>
        <div>
          <label className='mr-4 text-12 text-gray-600'>ID</label>
          <div className='flex items-center justify-between'>
            <input
              type="text"
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              {...register('id', { value: values.id })}
            />
            <ConfigBind name='id' />
          </div>
        </div>
        <label className="flex flex-col">
          Iframe 地址:
          <div className='flex justify-between items-center gap-10'>
            <input
              {...register('iframeAddr', { value: values.iframeAddr })}
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              placeholder="请填写"
            />
            <ConfigBind name='iframeAddr' />
          </div>
        </label>
        <label className="flex flex-col">
          iframe 宽度:
          <div className='flex justify-between items-center gap-10'>
            <input
              {...register('iframeWidth', { value: values.iframeWidth })}
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              placeholder="请填写"
              value={values.iframeWidth}
            />
            <ConfigBind name='iframeWidth' />
          </div>
        </label>

        <label className="flex flex-col">
          iframe 高度:
          <div className='flex justify-between items-center gap-10'>
            <input
              {...register('iframeHeight', { value: values.iframeHeight })}
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              placeholder="请填写"
              value={values.iframeHeight}
            />
            <ConfigBind name='iframeHeight' />
          </div>
        </label>
        <label className="flex flex-col">
          iframe 名称:
          <div className='flex justify-between items-center gap-10'>
            <input
              {...register('iframeName', { value: values.iframeName })}
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              placeholder="请填写"
              value={values.iframeName}
            />
            <ConfigBind name='iframeName' />
          </div>
        </label>
        <label className="flex flex-col">
          iframe 额外限制:
          <div className='flex justify-between items-center gap-10'>
            <input
              {...register('sandbox', { value: values.sandbox })}
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              placeholder="请填写"
            />
            <ConfigBind name='sandbox' />
          </div>
        </label>
        <label className="flex flex-col">
          iframe 允许范围:
          <div className='flex justify-between items-center gap-10'>
            <input
              {...register('iframeAllow', { value: values.iframeAllow })}
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              placeholder="请填写"
            />
            <ConfigBind name='iframeAllow' />
          </div>
        </label>
        <label className="flex justify-between items-center gap-10">
          <div className='flex items-center justify-between border-1 border-gray-200 p-6 rounded-8 flex-1'>
            <div className="flex items-center justify-center">
              <span className='ml-4 text-12 text-gray-900'>允许激活全屏模式</span>
            </div>
            <div className="flex items-center justify-center gap-10">
              <input {...register('allowFullscreen', { value: values.allowFullscreen })} type="checkbox" />
            </div>
          </div>
          <ConfigBind name='allowFullscreen' />
        </label>
        <label className="flex flex-col">
          iframe 推荐配置:
          <div className='flex justify-between items-center gap-10'>
            <select
              {...register('referrerPolicy')}
              className="p-6 flex-1 border-1 rounded-8 border-gray-200"
            >
              <option value="">请选择</option>
              <option value="no-referrer">no-referrer</option>
              <option value="no-referrer-when-downgrade">no-referrer-when-downgrade</option>
              <option value="origin">origin</option>
              <option value="origin-when-cross-origin">origin-when-cross-origin</option>
              <option value="same-origin">same-origin</option>
              <option value="strict-origin">strict-origin</option>
              <option value="strict-origin-when-cross-origin">strict-origin-when-cross-origin</option>
              <option value="unsafe-url">unsafe-url</option>
            </select>
            <ConfigBind name='referrerPolicy' />
          </div>
        </label>
      </form>
    </div>
  );
}

export default ConfigForm;
