import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';

import { Icon, Select, Tooltip } from '@one-for-all/ui';
import { useCtx, DataBind as ConfigBind } from '../../../index';

import type { InputProps } from '@one-for-all/ui';

export const DEFAULT_CONFIG: InputProps = {
  defaultValue: undefined,
  value: undefined, // if value undefined, input is non-controlled component
  placeholder: '请输入内容',
  type: 'text',
  id: '',
  name: '',
};

const inputCls = 'border border-gray-300 corner-2-8-8-8 mr-8 px-8 py-4 w-full text-gray-600';

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<InputProps>(defaults(page.activeElemProps, DEFAULT_CONFIG));

  // useEffect(() => {
  //   page.updateElemProperty(page.activeElem.id, 'props', values);
  // }, [values]);

  const handleChange = (name: string, value: any): void => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className='mb-8'>
        <p>占位符</p>
        <div className='flex items-center'>
          <input
            className={inputCls}
            value={values.placeholder}
            onChange={(ev) => handleChange('placeholder', ev.target.value)}
          />
          <ConfigBind name='placeholder' />
        </div>
      </div>
      <div className='mb-8'>
        <p>ID</p>
        <div className='flex items-center'>
          <input
            className={inputCls}
            value={values.id}
            onChange={(ev) => handleChange('id', ev.target.value)}
          />
          <ConfigBind name='id' />
        </div>
      </div>
      <div className='mb-8'>
        <p>name</p>
        <div className='flex items-center'>
          <input
            className={inputCls}
            value={values.name}
            onChange={(ev) => handleChange('name', ev.target.value)}
          />
          <ConfigBind name='name' />
        </div>
      </div>
      <div className='mb-8'>
        <p className='flex items-center'>
          <label className='mr-4 text-12 text-gray-600'>默认值</label>
          <Tooltip position='top' label='只设置默认值，该组件将成为非受控组件，如果设置了value将会覆盖默认值'>
            <Icon name='info' />
          </Tooltip>
        </p>
        <div className='flex items-center'>
          <input
            className={inputCls}
            value={values.defaultValue}
            onChange={(ev) => handleChange('defaultValue', ev.target.value)}
          />
          <ConfigBind name='defaultValue' />
        </div>
      </div>
      <div className='mb-8'>
        <p className='flex items-center'>
          <label className='mr-4 text-12 text-gray-600'>值</label>
          <Tooltip position='top' label='如果设置了value，该组件将成为受控组件'>
            <Icon name='info' />
          </Tooltip>
        </p>
        <div className='flex items-center'>
          <input
            className={inputCls}
            value={values.value}
            onChange={(ev) => handleChange('value', ev.target.value)}
          />
          <ConfigBind name='value' />
        </div>
      </div>
      <div>
        <p>input类型：</p>
        <Select
          value={values.type}
          options={[
            { label: '文本框', value: 'text' },
            { label: '密码框', value: 'password' },
            { label: '数值', value: 'number' },
          ]}
          onChange={(type) => handleChange('type', type)}
        >
        </Select>
      </div>
    </>
  );
}
export default ConfigForm;
