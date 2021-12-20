import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';
import { useForm } from 'react-hook-form';

import { Icon } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import type { InputProps } from '@ofa/ui';

export const defaultConfig: InputProps = {
  placeholder: '请输入内容',
  type: 'text',
};

interface configProps {
  name: string;
  msg: string;
  type: string;
}
const configItems: configProps[] = [
  {
    name: 'placeholder', // key
    msg: '默认值', // 显示信息
    type: 'text', // type 类型
  },
];

function ConfigForm(): JSX.Element {
  const { register, getValues } = useForm();
  const { page } = useCtx();
  const [values, setValues] = useState(defaults(page.activeElem.props, defaultConfig));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  const handleChange = (): void => {
    const formValue = getValues();
    setValues({ ...formValue, type: values.type });
  };

  const changeType = (e: React.ChangeEvent<any>): void => {
    const nextType: string = e.target.value;
    setValues((_values: any) => {
      return {
        ..._values,
        type: nextType,
      };
    });
  };

  return (
    <form className='flex flex-col' onChange={handleChange}>
      {
        configItems.map((item) => {
          return (
            <div className='mb-10' key={item.name}>

              <div className='mb-4 flex items-center'>
                <label htmlFor='placeholder' className='mr-4 text-12 text-gray-600'>{item.msg}</label>
                <Icon name='info' color='gray' />
              </div>

              <div className='flex items-center'>
                <input
                  className='mr-8 px-8 py-4 w-full text-gray-600'
                  type={item.type}
                  {...register('isAllowSelect', { value: values.isAllowSelect })}
                />
              </div>
            </div>
          );
        })
      }
      <label htmlFor="type">input类型：</label>
      <select
        name="type"
        id="type"
        style={{ border: '1px solid #AAA', height: '30px' }}
        onChange={(e) => {
          e.stopPropagation();
          e.preventDefault();
          changeType(e);
        }}
      >
        <option value="text">文本框</option>
        <option value="password">密码框</option>
        <option value="tel">电话号码</option>
      </select>
    </form>
  );
}
export default ConfigForm;
