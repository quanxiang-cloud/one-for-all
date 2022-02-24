import React, { useEffect, useState } from 'react';
import { defaults, noop } from 'lodash';

import { useCtx, DataBind as ConfigBind } from '../../../index';
import { Select } from '@one-for-all/ui';

import type { Props } from './button';

const modifierOptions: { label: string, value: 'primary' | 'danger' | 'default' }[] = [
  { label: '主要', value: 'primary' },
  { label: '默认', value: 'default' },
  { label: '危险', value: 'danger' },
];

const sizeOptions: { label: string, value: 'normal' | 'compact' }[] = [
  { label: '正常', value: 'normal' },
  { label: '紧凑', value: 'compact' },
];

const typeOptions: { label: string, value: 'button' | 'submit' | 'reset' }[] = [
  { label: '按钮', value: 'button' },
  { label: '提交', value: 'submit' },
  { label: '重置', value: 'reset' },
]

export const DEFAULT_CONFIG = {
  title: '按钮',
  modifier: 'primary',
  type: 'button',
  size: 'normal',
  iconSize: 12,
  iconName: '',
  preview: false,
  closeOnMaskClick: false,
  onClick: noop,
};

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<Props>(defaults(page.activeElemProps, DEFAULT_CONFIG));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  return (
    <div>
      <div className="flex flex-col">
        <div className='mb-8'>
          <label className='mr-4 text-12 text-gray-600'>ID</label>
          <div className='mb-8 flex items-center justify-between'>
            <input
              type="text"
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              value={values.id || ''}
              onChange={(e) => setValues((prev) => ({ ...prev, id: e.target.value }))}
            />
            <ConfigBind name='id' />
          </div>
        </div>
        <div className='text-12 text-gray-600'>按钮名称</div>
        <div className='flex justify-between items-center gap-10'>
          <input
            name='title'
            className="px-8 py-4 flex-1 border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
            placeholder="请填写"
            maxLength={30}
            value={values.title || ''}
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
          />
          <ConfigBind name='title' />
        </div>
      </div>
      <div className='mt-8 text-12 text-gray-600'>按钮类型</div>
      <div className="config-item">
        <Select
          className="w-full mr-4 border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
          options={modifierOptions}
          value={values.modifier}
          onChange={(value) => setValues({ ...values, modifier: value })}
        />
      </div>
      <div className='mt-8 text-12 text-gray-600'>按钮功能</div>
      <div className="config-item">
        <Select
          className="w-full mr-4 border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
          options={typeOptions}
          value={values.type}
          onChange={(value) => setValues({ ...values, type: value })}
        />
      </div>
      <div className='mt-8 text-12 text-gray-600'>按钮大小</div>
      <div className="config-item">
        <Select
          className="w-full mr-4 border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
          options={sizeOptions}
          value={values.size}
          onChange={(value) => setValues({ ...values, size: value })}
        />
      </div>
      <div className="flex flex-col">
        <div className='mt-8 text-12 text-gray-600'>图标名称</div>
        <div className='flex justify-between items-center gap-10'>
          <input
            className="px-8 py-4 flex-1 border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
            placeholder="请填写"
            value={values.iconName}
            onChange={(e) => setValues({ ...values, iconName: e.target.value })}
          />
        </div>
        <div className='mt-8 text-12 text-gray-600'>图标大小</div>
        <div className='flex justify-between items-center gap-10'>
          <input
            type='number'
            min="0"
            step='1'
            className="px-8 py-4 flex-1 border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
            placeholder="请填写"
            value={values.iconSize}
            onChange={(e) => setValues({ ...values, iconSize: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}

export default ConfigForm;

