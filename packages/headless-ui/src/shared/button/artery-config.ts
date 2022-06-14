import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '基础组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'smart_button',
        initialProps: {},
      },
      desc: '按钮用于提交、提示、操作',
      label: '按钮',
      initialProps: {
        children: '按钮',
        modifier: 'primary',
        type: 'button',
        size: 'normal',
        iconSize: 12,
        iconName: '',
        preview: false,
        closeOnMaskClick: false,
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '按钮类型',
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
            label: '危险',
            value: 'danger',
          },
        ],
      },
    },
    {
      label: '按钮功能',
      name: 'type',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '按钮',
            value: 'button',
          },
          {
            label: '提交',
            value: 'submit',
          },
          {
            label: '重置',
            value: 'reset',
          },
        ],
      },
    },
    {
      label: '按钮大小',
      name: 'type',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '正常',
            value: 'normal',
          },
          {
            label: '紧凑',
            value: 'compact',
          },
        ],
      },
    },
    {
      label: '加载',
      name: 'loading',
      type: 'boolean',
    },
    {
      label: '禁用',
      name: 'forbidden',
      type: 'boolean',
    },
    {
      label: '图标名称',
      name: 'iconName',
      type: 'string',
    },
    {
      label: '图标大小',
      name: 'iconSize',
      type: 'number',
    },
    {
      label: '点击事件',
      name: 'onClick',
      type: 'function',
    },
  ],
  isContainer: true,
  isOverLayer: false,
};

export default {
  key: 'Button',
  manifest,
  propsSpec,
};
