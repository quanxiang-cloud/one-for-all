import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '高级组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'swap_horiz',
        initialProps: {},
      },
      desc: '轮播图片',
      label: '轮播图',
      initialProps: {
        images: [''],
        defaultIndex: 0,
        disableAutoplay: false,
        autoplaySpeed: 3000,
        hideDots: false,
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '图片路径',
      name: 'images',
      type: 'object',
      will: 'ImageUrlGroup',
    },
    {
      label: '默认图片编号',
      name: 'defaultIndex',
      type: 'number',
      willProps: {
        min: 0,
      },
    },
    {
      label: '禁止自动播放',
      name: 'disableAutoplay',
      type: 'boolean',
    },
    {
      label: '自动播放速度',
      name: 'autoplaySpeed',
      type: 'number',
      desc: '单位：毫秒',
    },
    {
      label: '隐藏切换点',
      name: 'hideDots',
      type: 'boolean',
    },
    {
      label: '图片变化事件',
      name: 'onChange',
      type: 'function',
      willProps: {
        args: 'value',
      },
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'SwiperImage',
  manifest,
  propsSpec,
};
