import React, { useState, useEffect } from 'react';
import { defaults } from 'lodash';

import { useCtx, DataBind as ConfigBind } from '../../../index';
import { Radio, RadioGroup } from '@one-for-all/ui';
export interface DateTimePickerProps {
  name: string;
  value: number;
  defaultValue: number;
  dateType: 'datetime-local' | 'date';
}

export const DEFAULT_CONFIG: DateTimePickerProps = {
  defaultValue: Math.floor(new Date().getTime() / 1000),
  value: Math.floor(new Date().getTime() / 1000),
  dateType: 'datetime-local',
  name: '',
};

function ConfigForm(props: DateTimePickerProps): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState(defaults(page.activeElemProps, DEFAULT_CONFIG));

  function handleChange(name: string, value: any): void {
    setValues((prev: DateTimePickerProps) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  return (
    <div>
      <form>
        <div className='mb-8'>
          <label className='mr-4 text-12 text-gray-600'>ID</label>
          <div className='mb-8 flex items-center justify-between'>
            <input
              type="text"
              className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
              value={values.id}
              onChange={(ev) => handleChange('id', ev.target.value)}
            />
            <ConfigBind name='id'/>
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
          <p className='text-12 text-gray-600'>时间类型</p>
          <div className='flex items-center justify-between mt-5'>
            <RadioGroup onChange={(dateType) => handleChange('dateType', dateType)}>
              <Radio
                label='日期'
                className='mr-20'
                value='date'
                defaultChecked={values.dateType === 'date'}
              />
              <Radio
                label='日期-时间'
                value='datetime-local'
                defaultChecked={values.dateType === 'datetime-local'}
              />
            </RadioGroup>
            <ConfigBind name='dateType' />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ConfigForm;
