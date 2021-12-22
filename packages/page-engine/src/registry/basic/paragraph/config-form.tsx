import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { defaults } from 'lodash';

import { useCtx } from '@ofa/page-engine';

import ConfigBind from '../../../designer/comps/config-item-bind';

const DEFAULT_CONFIG: Props = {
  content: '段落文本',
  maxLength: 2,
  isAllowSelect: false,
  isAllowSpace: false,
};

export interface Props {
  content?: string;
  maxLength?: number;
  isAllowSelect?: boolean;
  isAllowSpace?: boolean;
}

function ConfigForm(): JSX.Element {
  const { register, getValues, formState: { errors } } = useForm();
  const { page } = useCtx();
  const [values, setValues] = useState<Props>(defaults(page.activeElem.props, DEFAULT_CONFIG));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  function handleFormChange(): void {
    const _values = getValues();
    setValues(_values);
  }

  return (
    <form onChange={handleFormChange}>
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <label htmlFor="maxLength" className='mr-4 text-12 text-gray-600'>最大显示行数</label>
        </div>
        <div className='flex items-center'>
          <input
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            type="number"
            min={1}
            {...register('maxLength', { value: values.maxLength })}
          />
          <ConfigBind name='maxLength' />
        </div>
      </div>
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <label htmlFor="content" className='mr-4 text-12 text-gray-600'>文本内容</label>
        </div>
        <div className='flex'>
          <textarea
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            rows={4}
            {...register('content', { value: values.content, required: true, maxLength: 30 })}
          />
          <ConfigBind name='content' />
        </div>
        {/* TODO remove */}
        {errors.content && errors.content.type === 'required' && (
          <span className='text-12 text-gray-600'>请输入文本内容</span>
        )}
      </div>
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <label className='mr-4 text-12 text-gray-600'>其他</label>
        </div>
        <div className='mb-8 flex items-center justify-between'>
          <div className='flex items-center'>
            <input type="checkbox" {...register('isAllowSelect', { value: values.isAllowSelect })} />
            <span className='ml-8 text-12 text-gray-900'>可选中文本</span>
          </div>
          <ConfigBind name='isAllowSelect' />
        </div>
        {/* <div className='mb-8 flex items-center justify-between'>
          <div className='flex items-center'>
            <input type="checkbox" {...register('isAllowSpace', { value: values.isAllowSpace })} />
            <span className='ml-8 text-12 text-gray-900'>允许输入空格</span>
          </div>
          <Icon name="code" color="gray" className='cursor-pointer' />
        </div> */}
      </div>
    </form>
  );
}

export default ConfigForm;
