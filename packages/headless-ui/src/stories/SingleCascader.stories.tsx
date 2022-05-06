import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { expect } from '@storybook/jest';
import { userEvent, within, screen } from '@storybook/testing-library';

import Cascader from '../shared/cascader/index';

export const argTypes = {
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
  expandTrigger: {
    control: { type: 'inline-radio' },
    options: ['click', 'hover'],
    defaultValue: 'hover',
    description: '触发下一级展开的方式',
    table: {
      type: { summary: `click | hover` },
      defaultValue: { summary: 'hover' },
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
  selectedOptionRender: {
    // defaultValue: (label: React.ReactNode[]) => label.join('/'),
    description: '自定义选项的展示方式',
    table: {
      type: { summary: 'Function' },
      defaultValue: { summary: `(label: React.ReactNode[]) => label.join('/')` },
    },
  },
  dropdownRender: {
    // defaultValue: (menus: React.ReactNode) => menus,
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
}

const componentMeta: ComponentMeta<typeof Cascader> =  {
  title: 'headless-ui/Cascader',
  component: Cascader,
  argTypes,
  excludeStories: ['argTypes', 'options'],
};

export default componentMeta;

const Template: ComponentStory<typeof Cascader> = (args) => <Cascader {...args} />;
export const options = [
  {
    label: 'test',
    value: 'test',
  },
  {
    label: 'test1',
    value: 'test1',
    children: [
      {
        label: 'test11',
        value: 'test11',
      },
      {
        label: 'test12',
        value: 'test12',
        children: [
          {
            label: 'test121',
            value: 'test121',
          },
          {
            label: 'test122',
            value: 'test122',
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
        label: 'test21',
        value: 'test21',
        disabled: true,
      },
      {
        label: 'test22',
        value: 'test22',
        disabled: true,
        children: [
          {
            label: 'test221',
            value: 'test221',
          },
          {
            label: 'test222',
            value: 'test222',
          },
        ],
      },
    ],
  },
];

export const Single = Template.bind({});
Single.args = {
  options,
  disabled: true,
  defaultValue: 'test121',
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
  selectedOptionRender: (label, selectedOptions) =>
    (selectedOptions as CascaderOptionType[])?.map((option, index) => (
      <span key={index}>{`${option.label}: ${option.value};`}</span>
    )),
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
