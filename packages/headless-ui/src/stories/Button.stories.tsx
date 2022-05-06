import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../shared/button';

const Meta: ComponentMeta<typeof Button> = {};

export default {
  title: 'headless-ui/Button',
  component: Button,
  argTypes: {
    children: {
      description: '111',
    },
    onClick: {
      action: 'onClick1',
      table: {
        category: 'Events',
        type: { summary: 'Function' },
      },
      description: '点击事件',
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Normal = Template.bind({});

Normal.args = {
  children: 'button',
};

export const Loading = Template.bind({});

Loading.args = {
  children: 'test loading',
  loading: true,
};
