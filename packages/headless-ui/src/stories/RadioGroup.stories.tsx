import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Radio, { RadioGroup } from '../shared/radio';

export default {
  title: 'headless-ui/RadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: '初始选中的值',
      table: {
        type: { summary: 'string | number' },
      },
    },
  },
} as ComponentMeta<typeof RadioGroup>;

export const Normal = () => (
  <RadioGroup value="first">
    <Radio value="first" label="first" />
    <Radio value="second" label="second" />
  </RadioGroup>
);
