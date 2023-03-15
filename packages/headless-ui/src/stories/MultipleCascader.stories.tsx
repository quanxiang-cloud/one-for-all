import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { MultipleCascader } from '../shared/cascader/index';
import { argTypes, options } from './SingleCascader.stories';

const componentMeta: ComponentMeta<typeof MultipleCascader> =  {
  title: 'headless-ui/Cascader',
  component: MultipleCascader,
  argTypes,
};

export default componentMeta;

const Template: ComponentStory<typeof MultipleCascader> = (args) => <MultipleCascader {...args} />;

export const Multiple = Template.bind({});
Multiple.args = {
  options,
  defaultValue: ['test12', 'test'],
  onChange: (value) => {
    console.log(value);
  },
};

export const MultipleSearch = Template.bind({});
MultipleSearch.args = {
  options,
  showSearch: true,
};
