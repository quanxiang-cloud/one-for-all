import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '表单组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'toggle_off',
        initialProps: {},
      },
      desc: '决定某个元素是否启用',
      label: '开关',
      initialProps: {
        onText: '开启',
        offText: '关闭',
        disabled: false,
        checked: false,
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '开启文案',
      name: 'onText',
      type: 'string',
    },
    {
      label: '关闭文案',
      name: 'offText',
      type: 'string',
    },
    {
      label: '禁用',
      name: 'disabled',
      type: 'boolean',
    },
    {
      label: '默认开启',
      name: 'checked',
      type: 'boolean',
    },
    {
      label: '变化事件',
      name: 'onChange',
      type: 'function',
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Switch',
  manifest,
  propsSpec,
};
