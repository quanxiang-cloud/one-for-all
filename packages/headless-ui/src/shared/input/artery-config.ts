import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '表单组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'text_fields',
        initialProps: {
          size: 24,
        },
      },
      desc: '单行文本框用于输入',
      label: '单行文本',
      initialProps: {
        placeholder: '请输入内容',
        type: 'text',
        name: '',
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '类型',
      name: 'type',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '文本框',
            value: 'text',
          },
          {
            label: '密码框',
            value: 'password',
          },
          {
            label: '数字',
            value: 'number',
          },
        ],
      },
    },
    {
      label: '占位符',
      name: 'placeholder',
      type: 'string',
      initialValue: '请输入内容',
    },
    {
      label: 'name',
      name: 'name',
      type: 'string',
    },
    {
      label: '默认值',
      name: 'defaultValue',
      type: 'string',
    },
    {
      label: '禁用',
      name: 'disabled',
      type: 'boolean',
    },
    {
      label: '只读',
      name: 'readOnly',
      type: 'boolean',
    },
    {
      label: '错误',
      name: 'error',
      type: 'boolean',
    },
    {
      label: '点击事件',
      name: 'onChange',
      type: 'function',
    },
    {
      label: '键盘按下事件',
      name: 'onKeydown',
      type: 'function',
    },
    {
      label: '聚焦事件',
      name: 'onFocus',
      type: 'function',
    },
    {
      label: '失焦事件',
      name: 'onBlur',
      type: 'function',
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Input',
  manifest,
  propsSpec,
};
