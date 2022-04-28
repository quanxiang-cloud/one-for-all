import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SwiperImage from '../shared/swiper-image';

export default {
  title: 'headless-ui/SwiperImage',
  component: SwiperImage,
  argTypes: {
    images: {
      defaultValue: [],
      description: '图片的url数组',
    },
    defaultIndex: {
      defaultValue: 0,
      description: '默认位置',
      control: 'number',
    },
    autoplay: {
      defaultValue: true,
      description: '是否自动播放',
      control: 'boolean',
    },
    autoplaySpeed: {
      name: 'autoplaySpeed',
      defaultValue: 3000,
      description: '自动轮播间隔，单位ms',
      control: 'number',
    },
    showDots: {
      defaultValue: true,
      description: '是否显示面板指示点',
      control: 'boolean',
    },
    onChange: {
      table: {
        category: 'Events',
        type: { summary: 'function(current)' },
      },
      description: '切换索引的回调',
    },
  },
} as ComponentMeta<typeof SwiperImage>;

const Template: ComponentStory<typeof SwiperImage> = (args) => <SwiperImage {...args} />;

export const Normal = Template.bind({});

Normal.args = {
  images: [],
  style: {height: '500px'},
};
