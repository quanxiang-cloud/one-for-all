import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '基础组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'tag',
        initialProps: {},
      },
      desc: '标签',
      label: '标签',
      initialProps: {
        label: '标签',
        value: 'tag',
        deleteIconSize: 12,
        disabled: false,
        modifier: '',
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '文本',
      name: 'label',
      type: 'string',
    },
    {
      label: '值',
      name: 'value',
      type: 'string',
    },
    {
      label: '删除图标尺寸',
      name: 'deleteIconSize',
      type: 'number',
      desc: '仅在配置了删除事件后生效',
    },
    {
      label: '禁用',
      name: 'disabled',
      type: 'boolean',
    },
    {
      label: '类型',
      name: 'modifier',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '默认',
            value: '',
          },
          {
            label: '主要',
            value: 'primary',
          },
          {
            label: '次要',
            value: 'secondary',
          },
          {
            label: '危险',
            value: 'danger',
          },
          {
            label: '成功',
            value: 'success',
          },
        ],
      },
    },
    {
      label: '删除事件',
      name: 'onDelete',
      type: 'function',
      willProps: {
        args: 'value, e',
      },
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Tag',
  manifest,
  propsSpec,
};
