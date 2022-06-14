import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '基础组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'loading',
        initialProps: {},
      },
      desc: '显示加载状态',
      label: '加载组件',
      initialProps: {
        desc: 'loading...',
        iconSize: 12,
        vertical: true,
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '描述',
      type: 'string',
      name: 'desc',
    },
    {
      label: '图标大小',
      type: 'number',
      name: 'iconSize',
    },
    {
      label: '垂直',
      type: 'boolean',
      name: 'vertical',
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Loading',
  manifest,
  propsSpec,
};
