import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Cascader from '../shared/cascader';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'headless-ui/Cascader',
  component: Cascader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Cascader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Cascader> = (args) => <Cascader {...args} />;
const options = [
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
      },
      {
        label: 'test4',
        value: 'test4',
        children: [
          {
            label: 'test3',
            value: 'test3',
          },
          {
            label: 'test4',
            value: 'test4',
          },
        ],
      },
    ],
  },
  {
    label: 'test2',
    value: 'test2',
    children: [
      {
        label: 'test3',
        value: 'test3',
        disabled: true,
      },
      {
        label: 'test4',
        value: 'test4',
        disabled: true,
        children: [
          {
            label: 'test3',
            value: 'test3',
          },
          {
            label: 'test4',
            value: 'test4',
          },
        ],
      },
    ],
  },
];
const value: CascaderValue = [];

export const Normal = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Normal.args = {
  options,
  disabled: true,
  defaultValue: ['test1', 'test4'],
  value,
  id: 'test-cascader',
  name: 'label: ',
  expandTrigger: 'click',
  expandIcon: <span style={{ marginLeft: 10, color: 'red' }}>&gt;</span>,
  suffixIcon: <span>⬇️</span>,
  placeholder: '提示文字',
  changeOnSelect: false,
  popupClassName: 'my-popup-class',
  popupPlacement: 'bottom-start',
  onChange: (value) => {
    console.log(value);
  },
  onPopupVisibleChange: (visible) => {
    console.log(visible);
  },
  dropdownRender: (menus) => (
    <div>
      {menus}
      <p style={{ margin: 0 }}>footer content</p>
    </div>
  ),
  displayRender: (label, selectedOptions) =>
    (selectedOptions as CascaderOptionType[])?.map((option, index) => (
      <span key={index}>{`${option.label}: ${option.value};`}</span>
    )),
};

export const Multiple = Template.bind({});
Multiple.args = {
  options,
  multipleSelect: true,
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
              label: 'test3',
              value: 'test3',
              isLeaf: true,
            },
            {
              label: 'test4',
              value: 'test4',
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
  return <Cascader options={loadOptions} loadData={loadData} changeOnSelect />;
};

export const changeValue = () => {
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
              label: 'test3',
              value: 'test3',
              isLeaf: true,
            },
            {
              label: 'test4',
              value: 'test4',
            },
          ],
        },
      ],
    },
  ]);
  const [value, setValue] = useState<CascaderValue>([]);

  const handleChange = (currentValue: CascaderValue) => {
    if (currentValue.length === 1 && currentValue[0] === 'test1') {
      setValue(['test1', 'test3']);
    }
  };

  return <Cascader options={loadOptions} value={value} changeOnSelect onChange={handleChange} />;
};

export const NotData = Template.bind({});
NotData.args = {
  options: [],
  notFoundContent: <div>无选项</div>,
};
