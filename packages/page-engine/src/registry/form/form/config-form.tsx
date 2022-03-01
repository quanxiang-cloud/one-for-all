import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react';

import { Select } from '@one-for-all/ui';
import { useCtx, DataBind as ConfigBind } from '../../../index';

const targetOption = [{
  label: '在新窗口打开',
  value: '_blank'
},{
  label: '在当前窗口打开',
  value: '_self'
}]

const methodOption = [{
  label: 'get',
  value: 'get',
}, {
  label: 'post',
  value: 'post'
}]

export const DEFAULT_CONFIG: Props = {
  name: '',
  action: '',
  method: 'get',
  target: '_blank',
};

export interface Props {
  name?: string;
  action?: string;
  method?: string;
  target?: string;
}

function ConfigForm(): JSX.Element {
  const { register, getValues, reset } = useForm();
  const { page } = useCtx();
  const [values, setValues] = useState(getDefaultProps());
  const { activeElem } = page;

  useEffect(() => {
    page.updateElemProperty(activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    const _values = getDefaultProps();
    setValues(_values);
    reset(_values);
  }, [page.activeElemId]);

  function getDefaultProps(): Record<string, any> {
    return defaults({}, page.activeElemProps, DEFAULT_CONFIG);
  }

  function handleFormChange(): void {
    const _values = getValues();
    setValues(_values);
  }

  return (
    <form onChange={handleFormChange}>
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <label className='mr-4 text-12 text-gray-600'>ID</label>
        </div>
        <div className='mb-8 flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            {...register('id', { value: values.id || '' })} />
          <ConfigBind name='id' />
        </div>
      </div>
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <label className='mr-4 text-12 text-gray-600'>name</label>
        </div>
        <div className='mb-8 flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            {...register('name', { value: values.name || '' })} />
          <ConfigBind name='name' />
        </div>
      </div>
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <label className='mr-4 text-12 text-gray-600'>action</label>
        </div>
        <div className='mb-8 flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            {...register('action', { value: values.action || '' })} />
          <ConfigBind name='action' />
        </div>
      </div>
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <label className='mr-4 text-12 text-gray-600'>method</label>
        </div>
        <div className='mb-8 flex items-center justify-between'>
          <Select
            className="my-8 w-full mr-4"
            options={methodOption}
            value={values.method}
            onChange={(value) => setValues({ ...values, method: value })}
          />
          <ConfigBind name='method' />
        </div>
      </div>
      <div className='mb-8'>
        <div className='mb-4 flex items-center'>
          <label className='mr-4 text-12 text-gray-600'>target</label>
        </div>
        <div className='mb-8 flex items-center justify-between'>
          <Select
            className="my-8 w-full mr-4"
            options={targetOption}
            value={values.target}
            onChange={(value) => setValues({ ...values, target: value })}
          />
          <ConfigBind name='target' />
        </div>
      </div>
    </form>
  );
}

export default observer(ConfigForm);
