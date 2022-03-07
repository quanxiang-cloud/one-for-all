import React, { useEffect, useState } from 'react';
import { defaults, noop } from 'lodash';

import { useCtx, DataBind as ConfigBind } from '../../../index';

import type { Props } from './checkbox';

export const DEFAULT_CONFIG = {
  checkboxOptions: '选项一\n选项二\n选项三',
  disabled: false,
  onChange: noop,
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
    <>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>ID</label>
        <div className='mb-8 flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.id || ''}
            onChange={(e) => setValues({ ...values, id: e.target.value })}
          />
          <ConfigBind name='id' />
        </div>
      </div>
      <div className='text-12 text-gray-600'>选项</div>
      <div className='flex justify-between items-center gap-10'>
        <textarea
          className="px-8 py-4 flex-1 border corner-2-8-8-8 border-gray-300 focus:border-blue-600 h-152"
          placeholder="请填写"
          maxLength={30}
          value={values.checkboxOptions || ''}
          onChange={(e) => setValues({ ...values, checkboxOptions: e.target.value })}
        />
      </div>
    </>
  );
}
export default ConfigForm;
