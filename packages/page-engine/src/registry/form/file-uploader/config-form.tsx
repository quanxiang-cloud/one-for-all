import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';

import { Toggle } from '@one-for-all/ui';

import { useCtx, DataBind as ConfigBind } from '../../../index';


export interface FileUploaderConfigProps {
  name?: string;
  disabled?: boolean;
  acceptTypes?: string;
  multiple?: boolean;
  filesLimit?: number;
  maxFileSize?: number;
  description?: string;
  iconName?: string
}

export const DEFAULT_CONFIG = {
  name: '',
  acceptTypes: '',
  disabled: false,
  multiple: true,
  filesLimit: 0,
  maxFileSize: 5,
  description: '',
  iconName: 'backup'
}

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState(defaults(page.activeElemProps, DEFAULT_CONFIG));


  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  const handleChange = (name: string, value: any): void => {
    setValues((prev: FileUploaderConfigProps) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form>
        <div className='mb-8'>
          <label className='mr-4 text-12 text-gray-600'>ID</label>
          <div className='mb-8 flex items-center justify-between'>
            <input
              type="text"
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              value={values.id || ''}
              onChange={(ev) => handleChange('id', ev.target.value)}
            />
            <ConfigBind name='id' />
          </div>
        </div>
        <div className='mb-8'>
          <p>name</p>
          <div className='flex items-center'>
            <input
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              value={values.name}
              onChange={(ev) => handleChange('name', ev.target.value)}
            />
            <ConfigBind name='name' />
          </div>
        </div>
        <div className='mb-8'>
          <p>附件描述</p>
          <div className='flex items-center'>
            <input
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              value={values.description}
              onChange={(ev) => handleChange('description', ev.target.value.trim())}
            />
            <ConfigBind name='description' />
          </div>
        </div>
        <div className='mb-8'>
          <p>图标名称</p>
          <div className='flex items-center'>
            <input
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              value={values.iconName}
              onChange={(ev) => handleChange('iconName', ev.target.value)}
            />
            <ConfigBind name='iconName' />
          </div>
        </div>
        <div className='mb-8'>
          <p>上传文件类型</p>
          <div className='flex items-center'>
            <input
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              value={values.acceptTypes}
              onChange={(ev) => handleChange('acceptTypes', ev.target.value)}
            />
            <ConfigBind name='name' />
          </div>
        </div>
        <div className='mb-8'>
          <label className='mr-4 text-12 text-gray-600'>禁用</label>
          <div className='flex items-center justify-between'>
            <Toggle defaultChecked={values.disabled} onChange={(disabled: boolean) => handleChange('disabled', disabled)} />
            <ConfigBind name='disabled' />
          </div>
        </div>
        <div className='mb-8'>
          <label className='mr-4 text-12 text-gray-600'>允许多个文件</label>
          <div className='flex items-center justify-between'>
            <Toggle defaultChecked={values.multiple} onChange={(multiple: boolean) => handleChange('multiple', multiple)} />
            <ConfigBind name='multiple' />
          </div>
        </div>
        <div className='mb-8'>
          <div className='mb-4 flex items-center'>
            <label htmlFor="maxLength" className='mr-4 text-12 text-gray-600'>文件数量限制</label>
          </div>
          <div className='flex items-center'>
            <input
              disabled={!values.multiple}
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              type="number"
              min={0}
              value={values.filesLimit}
              onChange={(ev) => handleChange('filesLimit', ev.target.value)}
            />
            <ConfigBind name='filesLimit' />
          </div>
        </div>
        <div className='mb-8'>
          <div className='mb-4 flex items-center'>
            <label htmlFor="maxLength" className='mr-4 text-12 text-gray-600'>文件整体大小限制(MB)</label>
          </div>
          <div className='flex items-center'>
            <input
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              type="number"
              min={1}
              value={values.maxFileSize}
              onChange={(ev) => handleChange('maxFileSize', ev.target.value)}
            />
            <ConfigBind name='maxFileSize' />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ConfigForm;
