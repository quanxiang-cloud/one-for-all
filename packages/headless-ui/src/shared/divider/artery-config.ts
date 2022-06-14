import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '基础组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'horizontal_distribute',
        initialProps: {},
      },
      desc: '分隔线',
      label: '分隔线',
      initialProps: {
        direction: 'horizontal',
        size: '100%',
        thickness: '1px',
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '方向',
      type: 'string',
      name: 'direction',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '水平',
            value: 'horizontal',
          },
          {
            label: '垂直',
            value: 'vertical',
          },
        ],
      },
    },
    {
      label: '尺寸',
      type: 'string',
      name: 'size',
    },
    {
      label: '粗细',
      type: 'string',
      name: 'thickness',
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Divider',
  manifest,
  propsSpec,
};
