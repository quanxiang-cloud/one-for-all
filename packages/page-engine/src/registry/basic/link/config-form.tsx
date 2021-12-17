import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';

import { useCtx } from '@ofa/page-engine';
import { Icon, Radio, RadioGroup, Select } from '@ofa/ui';

export interface Props {
  content: string,
  linkType: 'outside' | 'inside',
  linkUrl?: string,
  linkPage?: string,
  isBlank?: boolean,
}

const DEFAULT_CONFIG: Props = {
  content: '链接',
  linkType: 'inside',
  linkUrl: '',
  linkPage: '',
  isBlank: false,
};

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState(defaults(page.activeElem.props, DEFAULT_CONFIG));
  const example = [{ label: '示例页面', value: '#' }];

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  return (
    <form>
      <div className='mb-8'>
        <p className='text-12 text-gray-600'>内容</p>
        <div className='flex items-center'>
          <input
            type='text'
            className='w-full h-32 my-4 px-8 mr-8'
            value={values.content}
            onChange={(ev) => setValues({ ...values, content: ev.target.value })}
          />
          <Icon name="code" color="gray" className='cursor-pointer' />
        </div>
      </div>
      <div className='mb-8'>
        <p className='text-12 text-gray-600'>链接类型</p>
        <div className='flex items-center'>
          <RadioGroup
            onChange={(linkType) => setValues({ ...values, linkType })}
          >
            <Radio
              label='内部页面'
              className='mr-20'
              value='inside'
              defaultChecked={values.linkType === 'inside'}
            />
            <Radio label='外部链接' value='outside' defaultChecked={values.linkType === 'outside'} />
          </RadioGroup>
        </div>
      </div>
      {
        values.linkType === 'inside' ? (
          <div className='mb-8'>
            <p className='mr-4 text-12 text-gray-600'>选择页面</p>
            <Select
              name='insidePage'
              options={example}
              value={values.insidePage}
              onChange={(linkPage) => setValues({ ...values, linkPage })}
            />
          </div>
        ) : (
          <div className='mb-8'>
            <p className='mr-4 text-12 text-gray-600'>链接地址</p>
            <div className='flex items-center'>
              <input
                className='w-full h-32 my-4 px-8 mr-8'
                value={values.linkUrl}
                onChange={(ev) => setValues({ ...values, linkUrl: ev.target.value })}
              />
              <Icon name="code" color="gray" className='cursor-pointer' />
            </div>
          </div>
        )
      }
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            type="checkbox"
            className='w-full h-32 my-4 px-8 mr-8'
            value={values.isBlank}
            onChange={(ev) => setValues({ ...values, isBlank: ev.target.value })}
          />
          <span className='ml-8 text-12 text-gray-900'>新开页面</span>
        </div>
        <Icon name="code" color="gray" className='cursor-pointer' />
      </div>
    </form>
  );
}

export default ConfigForm;
