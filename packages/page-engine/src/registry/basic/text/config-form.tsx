import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';
import { useForm } from 'react-hook-form';

import { Icon } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

const DEFAULT_CONFIG: Props = {
  content: '文本',
  isAllowSelect: false,
};

export interface Props {
  content?: string;
  isAllowSelect?: boolean;
}

function ConfigForm(): JSX.Element {
  const { register, getValues } = useForm();
  const { page } = useCtx();
  const [values, setValues] = useState(defaults(page.activeElem.props, DEFAULT_CONFIG));

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
          <label htmlFor="content" className='mr-4 text-12 text-gray-600'>文本内容</label>
          <Icon name="info" color="gray" />
        </div>
        <div className='flex'>
          <textarea
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            rows={4}
            {...register('content', { value: values.content })}
          />
          <Icon name="code" color="gray" className='cursor-pointer' />
        </div>
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
          <Icon name="code" color="gray" className='cursor-pointer' />
        </div>
      </div>
    </form>
  );
}

export default ConfigForm;
