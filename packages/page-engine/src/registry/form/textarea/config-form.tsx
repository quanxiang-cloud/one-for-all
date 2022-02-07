import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';

import { TextareaProps } from '@one-for-all/ui';
import { useCtx, DataBind as ConfigBind } from '../../../index';

interface configProps {
  name: string;
  msg: string;
  type: string;
}

export const DEFAULT_CONFIG: TextareaProps = {
  placeholder: '请输入内容',
  cols: 40,
  rows: 5,
  minLength: 0,
  maxLength: 300,
};

const CONFIG_ITEMS: configProps[] = [
  {
    name: 'id',
    msg: 'ID',
    type: 'text',
  },
  {
    name: 'placeholder',
    msg: '占位符',
    type: 'text',
  },
  {
    name: 'name',
    msg: 'name',
    type: 'text',
  },
  {
    name: 'defaultValue',
    msg: '默认值',
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
  const { page } = useCtx();
  const [values, setValues] = useState<TextareaProps>(defaults(page.activeElemProps, DEFAULT_CONFIG));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  const handleChange = (name: string, value: any): void => {
    setValues((prev)=> ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col">
      {
        CONFIG_ITEMS.map(({ name, msg, type }) => {
          return (
            <div className="mb-10" key={name}>
              <div className="mb-4 flex items-center">
                <label className="mr-4 text-12 text-gray-600">{msg}</label>
              </div>
              <div className="flex items-center">
                <input
                  className="mr-8 px-8 py-4 w-full text-gray-600 border border-gray-300 corner-2-8-8-8"
                  type={type}
                  // @ts-ignore
                  value={values[name]}
                  onChange={(ev)=> handleChange(name, ev.target.value)}
                />
                <ConfigBind name={name} />
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default ConfigForm;
