import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react';

import { useCtx, DataBind as ConfigBind } from '../../../index';

export const DEFAULT_CONFIG: Props = {

};

export interface Props {
  // content?: string;
  // isAllowSelect?: boolean;
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
    </form>
  );
}

export default observer(ConfigForm);
