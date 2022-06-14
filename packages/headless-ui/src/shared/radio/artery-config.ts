import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '表单组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'radio_button_checked',
        initialProps: {},
      },
      desc: '单选框用于选中必要项并提交',
      label: '单选框',
      initialProps: {
        options: [
          {
            label: '选项一',
            value: '选项一',
          },
          {
            label: '选项二',
            value: '选项二',
          },
          {
            label: '选项三',
            value: '选项三',
          },
        ],
        disabled: false,
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '选项',
      name: 'options',
      type: 'object',
    },
    {
      label: 'name',
      name: 'name',
      type: 'string',
    },
    {
      label: '值',
      name: 'value',
      type: 'string',
    },
    {
      label: '禁用',
      name: 'disabled',
      type: 'boolean',
    },
    {
      label: '变化事件',
      name: 'onChange',
      type: 'function',
      willProps: {
        args: 'val',
        notes: 'val is an array of all checked checkbox value',
      },
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'RadioGroup',
  manifest,
  propsSpec,
};
