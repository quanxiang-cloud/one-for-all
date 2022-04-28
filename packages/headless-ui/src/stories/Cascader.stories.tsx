import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { expect } from '@storybook/jest';
import { userEvent, within, screen } from '@storybook/testing-library';

import Cascader from '../shared/cascader';

export default {
  title: 'headless-ui/Cascader',
  component: Cascader,
  argTypes: {
    options: {
      control: { type: 'object' },
      defaultValue: [],
      description: '级联的选项',
      table: {
        type: { summary: 'Array' },
        defaultValue: { summary: '[]' },
      },
    },
    defaultValue: {
      control: { type: 'object' },
      description: '级联选择的默认值',
      table: {
        type: { summary: 'Array' },
      },
    },
    value: {
      control: { type: 'object' },
      description: '级联选择的值',
      table: {
        type: { summary: 'Array' },
      },
    },
    model: {
      control: { type: 'inline-radio' },
      options: ['single', 'single-timely', 'multiple', 'unlink'],
      defaultValue: 'single',
      description: '级联选择的模式(single: 单选, single-timely: 可选择非叶子节点, multiple: 多选, unlink: 可单独选择子节点)',
      table: {
        type: { summary: 'single | single-timely | multiple | unlink' },
        defaultValue: { summary: 'single' },
      },
    },
    placeholder: {
      control: { type: 'text' },
      defaultValue: '请选择...',
      description: '未选择时的提示文字',
      table: {
        type: { summary: 'string' },
        defaultValue: {
          summary: '请选择...',
        },
      },
    },
    name: {
      control: { type: 'text' },
      description: '标签',
      table: {
        type: { summary: 'string' },
      },
    },
    id: {
      control: { type: 'text' },
      description: '组件的ID，绑定到内部的input上',
      table: {
        type: { summary: 'string' },
      },
    },
    expandTrigger: {
      control: { type: 'inline-radio' },
      options: ['click', 'hover'],
      defaultValue: 'click',
      description: '触发下一级展开的方式',
      table: {
        type: { summary: `click | hover` },
        defaultValue: { summary: 'click' },
      },
    },
    popupClassName: {
      control: { type: 'text' },
      description: '弹出框的classname',
      table: {
        type: { summary: 'string' },
      },
    },
    popupPlacement: {
      control: { type: 'select' },
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      defaultValue: 'bottom-start',
      description: '弹出框显示的位置',
      table: {
        type: { summary: `bottom-start | bottom-end | top-start | top-end` },
        defaultValue: { summary: 'bottom-start' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      defaultValue: false,
      description: '是否禁用',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    showSearch: {
      control: { type: 'boolean' },
      defaultValue: false,
      description: `是否开启搜索, 为object时: \n
      {\n
        filter?: (inputValue: string, path: CascaderOptionType[]) => boolean,\n
        sort?: (a: CascaderOptionType[], b: CascaderOptionType[], inputValue: string) => number | undefined,\n
        render?: (inputValue: string, path: CascaderOptionType[]) => React.ReactNode,\n
        limit?: boolean | number,\n
      }`,
      table: {
        type: { summary: 'boolean | object' },
        defaultValue: { summary: false },
      },
    },
    notFoundContent: {
      control: { type: 'object' },
      description: '没有选项时弹框内的提示',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'not option' },
      },
    },
    expandIcon: {
      control: { type: 'object' },
      description: '有子节点的选项尾部图标',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: '>' },
      },
    },
    suffixIcon: {
      control: { type: 'object' },
      description: '下拉图标',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: '>' },
      },
    },
    displayRender: {
      defaultValue: (label: React.ReactNode[]) => label.join('/'),
      description: '自定义选项的展示方式',
      table: {
        type: { summary: 'Function' },
        defaultValue: { summary: `(label: React.ReactNode[]) => label.join('/')` },
      },
    },
    dropdownRender: {
      defaultValue: (menus: React.ReactNode) => menus,
      description: '对弹出框的扩展',
      table: {
        type: { summary: 'Function' },
        defaultValue: { summary: `(menus: React.ReactNode) => menus` },
      },
    },
    onChange: {
      action: 'onChange',
      table: {
        category: 'Events',
        type: { summary: 'Function' },
      },
      description: '选择值发生变化时的回调',
    },
    onPopupVisibleChange: {
      action: 'onPopupVisibleChange',
      table: {
        category: 'Events',
        type: { summary: 'Function' },
      },
      description: '弹出框显隐变化时的回调',
    },
    // loadData: {
    //   action: 'loadData',
    //   table: {
    //     category: 'Events',
    //     type: { summary: 'Function' },
    //   },
    //   description: '当展开option，未标识叶子节点并且没有children时触发',
    // },
  },
} as ComponentMeta<typeof Cascader>;

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

export const Single = Template.bind({});
Single.args = {
  options,
  disabled: true,
  defaultValue: ['test1', 'test4', 'test3'],
  value,
  id: 'test-cascader',
  name: 'label: ',
  expandTrigger: 'click',
  expandIcon: <span style={{ marginLeft: 10, color: 'red' }}>&gt;</span>,
  suffixIcon: <span>⬇️</span>,
  placeholder: '提示文字',
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

export const SingleTimely = Template.bind({});
SingleTimely.args = {
  options,
  model: 'single-timely',
};

export const Multiple = Template.bind({});
Multiple.args = {
  options,
  model: 'multiple',
};

export const Unlink = Template.bind({});
Unlink.args = {
  options,
  model: 'unlink',
};

export const Search = Template.bind({});
Search.args = {
  options,
  showSearch: true,
};

export const SearchCustom = Template.bind({});
SearchCustom.args = {
  options,
  showSearch: {
    render: (inputValue, path) => {
      return (
        <>{path.map(({ value, label }, index) => (
          <span key={index}>{`${value}: ${label}${index === path.length - 1 ? '' : '->'}`}</span>
        ))}</>
      )
    },
    // limit: 2
    filter: (inputValue, path) => {
      return inputValue !== 't';
    },
    sort: (a, b, inputValue) => {
      if (inputValue === 's') return 1;
      if (inputValue === 'e') return -1;
      return 0;
    }
  },
};

export const MultipleSearch = Template.bind({});
MultipleSearch.args = {
  options,
  model: 'multiple',
  showSearch: true,
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
  return <Cascader options={loadOptions} loadData={loadData} model='single-timely' />;
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

  return <Cascader options={loadOptions} value={value} model='single-timely' onChange={handleChange} />;
};

export const NotData = Template.bind({});
NotData.args = {
  options: [],
  notFoundContent: <div>无选项</div>,
};

NotData.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = document.getElementsByTagName('body')[0];

  await userEvent.click(canvas.getByRole('ofa-cascader-display'));

  await expect(screen.queryByRole('ofa-cascader-empty')).not.toBeNull();

  await userEvent.click(body);

  await expect(screen.queryByRole('ofa-cascader-empty')).toBeNull();
};
