import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '高级组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'arrow_drop_down_circle',
        initialProps: {},
      },
      desc: '根据不同选项卡展示不同内容',
      label: '选项卡',
      initialProps: {
        items: [
          {
            name: '选项一',
            id: 'tab-1',
            disabled: false,
          },
          {
            name: '选项二',
            id: 'tab-2',
            disabled: false,
          },
        ],
        currentKey: 'tab-1',
        disabled: false,
        direction: 'horizon',
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '选项',
      name: 'items',
      type: 'object',
    },
    {
      label: '方向',
      name: 'direction',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '垂直',
            value: 'vertical',
          },
          {
            label: '水平',
            value: 'horizon',
          },
        ],
      },
    },
    {
      label: '当前选中',
      desc: '需要和items中设置的id一致才能生效',
      name: 'currentKey',
      type: 'string',
    },
    {
      label: '变化事件',
      name: 'onChange',
      type: 'function',
      willProps: {
        args: 'id',
      },
    },
    {
      label: '选项样式',
      name: 'navsClassName',
      type: 'string',
      will: 'ClassName',
    },
    {
      label: '内容样式',
      name: 'contentClassName',
      type: 'string',
      will: 'ClassName',
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Tab',
  manifest,
  propsSpec,
};
