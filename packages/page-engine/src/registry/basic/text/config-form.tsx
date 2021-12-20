import React, { useEffect, useState } from 'react';
import { defaults, get } from 'lodash';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { observer } from 'mobx-react';

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
  const { page, designer } = useCtx();
  const [values, setValues] = useState(defaults(page.activeElem.props, DEFAULT_CONFIG));
  const { activeElem } = page;

  useEffect(() => {
    page.updateElemProperty(activeElem.id, 'props', values);
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
          <Icon
            name="code"
            color="gray"
            clickable
            onClick={()=> designer.openDataBinding('content')}
            className={cs(get(activeElem, '_stateRef.content') ? 'bg-blue-200' : '')}
          />
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
          <Icon
            name="code"
            color="gray"
            clickable
            onClick={()=> designer.openDataBinding('isAllowSelect')}
            className={cs(get(activeElem, '_stateRef.isAllowSelect') ? 'bg-blue-200' : '')}
          />
        </div>
      </div>
    </form>
  );
}

export default observer(ConfigForm);
