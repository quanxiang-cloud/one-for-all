import React, { useContext, useEffect, useState } from 'react';
import { defaults } from 'lodash';
import { useForm } from 'react-hook-form';
import { Icon } from '@ofa/ui';

import ctx from '../../../ctx';
import { Props } from './textarea';

export const defaultConfig: Props = {
  placeholder: '请输入内容',
  cols: 30,
  rows: 10,
  minlength: 0,
  maxlength: 300,
  required: false,
};

interface configProps {
  name: string;
  msg: string;
  type: string;
}

const configItems: configProps[] = [
  {
    name: 'placeholder',
    msg: '占位语句',
    type: 'text',
  },
  {
    name: 'rows',
    msg: '行数',
    type: 'number',
  },
  {
    name: 'cols',
    msg: '列数',
    type: 'number',
  },
  {
    name: 'minlength',
    msg: '最小输入字符数',
    type: 'number',
  },
  {
    name: 'maxlength',
    msg: '最大输入字符数',
    type: 'number',
  },
];

function ConfigForm(): JSX.Element {
  const { register, getValues } = useForm();
  const { page } = useContext(ctx);
  const [values, setValues] = useState(defaults(page.activeElem.props, defaultConfig));

  useEffect(() => {
    page.updateElemProps(page.activeElem.id, values);
  }, [values]);

  const handleChange = (): void => {
    const formValue = getValues();
    setValues(formValue);
  };

  return (
    <form className="flex flex-col" onChange={handleChange}>
      {
        configItems.map((item, index) => {
          return (
            <div className="mb-10" key={item.name + index}>
              <div className="mb-4 flex items-center">
                <label htmlFor="placeholder" className="mr-4 text-12 text-gray-600">{item.msg}</label>
                <Icon name="info" color="gray"></Icon>
              </div>
              <div className="flex items-center">
                <input
                  className="mr-8 px-8 py-4 w-full text-gray-600"
                  type={item.type}
                  {...register(item.name, { value: values[item.name] })}
                />
              </div>
            </div>
          );
        })
      }
    </form>
  );
}

export default ConfigForm;
