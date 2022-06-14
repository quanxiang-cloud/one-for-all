import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '表单组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'arrow_drop_down_circle',
        initialProps: {},
      },
      desc: '单选下拉框',
      label: '单选下拉框',
      initialProps: {
        multiple: false,
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
    {
      icon: {
        type: 'platform',
        name: 'fact_check',
        initialProps: {},
      },
      desc: '多选下拉框',
      label: '多选下拉框',
      initialProps: {
        multiple: true,
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
      label: '占位符',
      name: 'placeholder',
      type: 'string',
    },
    {
      label: '选项描述',
      name: 'optionsDesc',
      type: 'string',
    },
    {
      label: '值',
      name: 'value',
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
      label: '变化事件',
      name: 'onChange',
      type: 'function',
    },
    {
      label: '选项显隐事件',
      name: 'onOptionsVisibilityChange',
      type: 'function',
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Select',
  manifest,
  propsSpec,
};
