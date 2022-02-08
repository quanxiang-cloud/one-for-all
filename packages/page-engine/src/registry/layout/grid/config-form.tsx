import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { defaults } from 'lodash';

import { Select, GridProps, Icon } from '@one-for-all/ui';

import { useCtx } from '../../../index';

export const DEFAULT_CONFIG: GridProps = {
  colRatio: '12:9:3',
  colGap: '16px',
  rowGap: '16px',
};

const DEFAULT_SCALE = ['12', '6:6', '3:9', '9:3', '4:4:4', '3:6:3', '3:3:3:3', '2:2:2:2:2:2'];

const DEFAULT_LIST = [
  { id: 1, value: '12', icon: 'grid-12' },
  { id: 2, value: '6:6', icon: 'grid-6-6' },
  { id: 3, value: '3:9', icon: 'grid-3-9' },
  { id: 4, value: '9:3', icon: 'grid-9-3' },
  { id: 5, value: '4:4:4', icon: 'grid-4-4-4' },
  { id: 6, value: '3:6:3', icon: 'grid-3-6-3' },
  { id: 7, value: '3:3:3:3', icon: 'grid-4-3' },
  { id: 8, value: '2:2:2:2:2:2', icon: 'grid-6-2' },
];

const gaps = ['8px', '12px', '16px', '20px'].map((value) => ({ label: value, value }));

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<GridProps>(defaults(page.activeElemProps, DEFAULT_CONFIG));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  function handleChangeLayout(value: string): void {
    setValues({
      ...values,
      colRatio: value,
    });
  }

  return (
    <form className='flex flex-col'>
      <div className='mb-8'>
        <div className='text-12 text-gray-400'>布局</div>
        <ul className='flex items-center flex-wrap'>
          {DEFAULT_LIST.map((item) => {
            return (
              <li
                key={item.id}
                onClick={() => handleChangeLayout(item.value)}
                className={cs('m-3 p-3 border rounded-4 cursor-pointer', {
                  'border-gray-300': item.value !== values.colRatio,
                  'border-blue-600': item.value === values.colRatio,
                })}
                style={{ width: 60, height: 36 }}>
                <Icon name={item.icon} style={{ width: 52, height: 28 }} />
              </li>
            );
          })}
          {!DEFAULT_SCALE.includes(values.colRatio) && (
            <li
              className='m-3 p-3 flex flex-col items-center border border-dashed
              rounded-4 cursor-pointer border-blue-600'
              style={{ width: 60 }}
            >
              <Icon name="edit_road"/>
              <span className='text-12 text-gray-600'>自定义</span>
            </li>
          )}
        </ul>
      </div>
      <div className='mb-8'>
        <p className='text-12 text-gray-400'>栅格比例</p>
        <input
          type="text"
          placeholder="0"
          className='mr-8 px-8 py-6 w-full border border-gray-300 corner-2-8-8-8'
          value={values.colRatio}
          onChange={(e) => setValues((prev: GridProps) => ({ ...prev, colRatio: e.target.value }))}
        />
        {/* <Select
          name='colRatio'
          options={ratios}
          value={values.colRatio}
          onChange={(colRatio: string) => setValues((prev) => ({ ...prev, colRatio }))}
        /> */}
      </div>
      <div className='mb-8'>
        <p className='text-12 text-gray-400'>列间距</p>
        <Select
          name='colGap'
          options={gaps}
          value={values.colGap}
          onChange={(colGap: string) => setValues((prev: GridProps) => ({ ...prev, colGap }))}
        />
      </div>
      <div>
        <p className='text-12 text-gray-400'>行间距</p>
        <Select
          name='rowGap'
          options={gaps}
          value={values.rowGap}
          onChange={(rowGap: string) => setValues((prev: GridProps) => ({ ...prev, rowGap }))}
        />
      </div>
    </form>
  );
}

export default ConfigForm;
