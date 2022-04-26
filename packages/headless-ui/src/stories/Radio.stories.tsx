import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Radio from '../shared/radio';

export default {
  title: 'headless-ui/Radio',
  component: Radio,
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = (args) => <Radio {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  label: 'test',
  value: 'test',
};

export const Checked = Template.bind({});
Checked.args = {
  label: 'checked',
  value: 'checked',
  checked: true,
};
