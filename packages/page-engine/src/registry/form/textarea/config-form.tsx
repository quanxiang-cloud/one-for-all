import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';
import { useForm } from 'react-hook-form';

import { Icon } from '@ofa/ui';
import { Props } from '@ofa/ui/src/textarea/index';
import { useCtx, DataBind as ConfigBind } from '@ofa/page-engine';

interface configProps {
  name: string;
  msg: string;
  type: string;
}

export const DEFAULT_CONFIG: Props = {
  placeholder: '请输入内容',
  cols: 30,
  rows: 10,
  minLength: 0,
  maxLength: 300,
};

const CONFIG_ITEMS: configProps[] = [
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
    name: 'minLength',
    msg: '最小输入字符数',
    type: 'number',
  },
  {
    name: 'maxLength',
    msg: '最大输入字符数',
    type: 'number',
  },
];

function ConfigForm(): JSX.Element {
  const { register, getValues } = useForm();
  const { page } = useCtx();
  const [values, setValues] = useState(defaults(page.activeElemProps, DEFAULT_CONFIG));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  const handleChange = (): void => {
    const formValue = getValues();
    setValues(formValue);
  };

  return (
    <form className="flex flex-col" onChange={handleChange}>
      {
        CONFIG_ITEMS.map((item, index) => {
          return (
            <div className="mb-10" key={item.name + index}>
              <div className="mb-4 flex items-center">
                <label htmlFor="placeholder" className="mr-4 text-12 text-gray-600">{item.msg}</label>
                <Icon name="info" color="gray" />
              </div>
              <div className="flex items-center">
                <input
                  className="mr-8 px-8 py-4 w-full text-gray-600"
                  type={item.type}
                  {...register(item.name, { value: values[item.name] })}
                />
                <ConfigBind name={item.name} />
              </div>
            </div>
          );
        })
      }
    </form>
  );
}

export default ConfigForm;
