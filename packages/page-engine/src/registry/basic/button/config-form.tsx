import React, { useEffect, useState } from 'react';
import { defaults, noop } from 'lodash';

import { useCtx, DataBind as ConfigBind } from '@ofa/page-engine';
import { Select } from '@ofa/ui';

import type { Props } from './button';

const modifierOptions: {label: string, value: 'primary' | 'danger'}[] = [
  { label: '主要', value: 'primary' },
  { label: '危险', value: 'danger' },
];

const sizeOptions: {label: string, value: 'normal' | 'compact'}[] = [
  { label: '正常', value: 'normal' },
  { label: '紧凑', value: 'compact' },
];

const defaultConfig = {
  title: '按钮',
  modifier: 'primary',
  size: 'normal',
  iconSize: 12,
  iconName: '',
  preview: false,
  closeOnMaskClick: false,
  onClick: noop,
};

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<Props>(defaults(page.activeElemProps, defaultConfig));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  return (
    <div>
      <div className="flex flex-col">
        按钮名称
        <div className='flex justify-between items-center gap-10'>
          <input
            name='title'
            className="px-8 py-4 flex-1"
            placeholder="请填写"
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
          />
          <ConfigBind name='title' />
        </div>
      </div>
        按钮类型
      <div className="config-item">
        <Select
          className="my-8 w-full mr-4"
          options={modifierOptions}
          value={values.modifier}
          onChange={(value) => setValues({ ...values, modifier: value })}
        />
      </div>
        按钮大小
      <div className="config-item">
        <Select
          className="my-8 w-full mr-4"
          options={sizeOptions}
          value={values.size}
          onChange={(value) => setValues({ ...values, size: value })}
        />
      </div>
      <div className="flex flex-col">
        图标名称
        <div className='flex justify-between items-center gap-10'>
          <input
            className="px-8 py-4 flex-1"
            placeholder="请填写"
            onChange={(e) => setValues({ ...values, iconName: e.target.value })}
          />
        </div>
        图标大小
        <div className='flex justify-between items-center gap-10'>
          <input
            type='number'
            className="px-8 py-4 flex-1"
            placeholder="请填写"
            onChange={(e) => setValues({ ...values, iconSize: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}

export default ConfigForm;

