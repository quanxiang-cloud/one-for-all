import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { UnlinkCascader } from '../shared/cascader/index';
import { argTypes, options } from './SingleCascader.stories';

const componentMeta: ComponentMeta<typeof UnlinkCascader> =  {
  title: 'headless-ui/Cascader',
  component: UnlinkCascader,
  argTypes,
};

export default componentMeta;

const Template: ComponentStory<typeof UnlinkCascader> = (args) => <UnlinkCascader {...args} />;

export const Unlink = Template.bind({});
Unlink.args = {
  options,
};
