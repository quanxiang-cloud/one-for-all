import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { expect } from '@storybook/jest';
import { userEvent, screen } from '@storybook/testing-library';

import { TimelyCascader } from '../shared/cascader/index';
import { argTypes, options } from './SingleCascader.stories';

const componentMeta: ComponentMeta<typeof TimelyCascader> =  {
  title: 'headless-ui/Cascader',
  component: TimelyCascader,
  argTypes,
};

export default componentMeta;

const Template: ComponentStory<typeof TimelyCascader> = (args) => <TimelyCascader {...args} />;

export const Timely = Template.bind({});
Timely.args = {
  options,
};

export const loadData = () => {
  const [loadOptions, setLoadOptions] = useState([
    {
      label: 'test',
      value: 'test',
    },
    {
      label: 'test1',
      value: 'test1',
      children: [
        {
          label: 'test3',
          value: 'test3',
          isLeaf: true,
        },
        {
          label: 'test4',
          value: 'test4',
          children: [
            {
              label: 'test5',
              value: 'test5',
              isLeaf: true,
            },
            {
              label: 'test6',
              value: 'test6',
            },
          ],
        },
      ],
    },
  ]);
  const loadData = (selectedOptions?: CascaderOptionType[]) => {
    console.log(selectedOptions);
    if (!selectedOptions) return;
    const currentOption = selectedOptions[selectedOptions?.length - 1];
    setTimeout(() => {
      if (currentOption.value === 'test') {
        currentOption.children = [
          {
            label: '无数据...',
            value: 'empty',
            disabled: true,
          },
        ];
      } else {
        currentOption.children = [
          {
            label: 'test ok',
            value: 'test ok',
            isLeaf: true,
          },
        ];
      }

      setLoadOptions(JSON.parse(JSON.stringify(loadOptions)));
    }, 2000);
  };
  return <TimelyCascader options={loadOptions} expandTrigger="click" loadData={loadData} />;
};

loadData.play = async () => {
  function waitTime(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  await userEvent.click(screen.getByRole('ofa-cascader-display'));
  await userEvent.click(screen.getByText('test'));
  await waitTime(2050);
  await expect(screen.queryByText('无数据...')).not.toBeNull();

  await userEvent.click(screen.getByText('test1'));
  await userEvent.click(screen.getByText('test4'));
  await userEvent.click(screen.getByText('test6'));
  await waitTime(2050);
  await expect(screen.queryByText('test ok')).not.toBeNull();

  await userEvent.click(screen.getByText('test ok'));
  await waitTime(50);
  await expect(screen.getByRole('ofa-cascader-value').innerText).toBe('test1/test4/test6/test ok');
};
