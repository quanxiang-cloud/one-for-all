import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '高级组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'border_all',
        initialProps: {},
      },
      desc: '表格展示数据',
      label: '表格',
      initialProps: {
        columns: [
          {
            width: 100,
            fixed: false,
            Header: 'Dessert',
            id: 'dessert',
            accessor: 'dessert',
          },
          {
            Header: 'Calories',
            id: 'calories',
            accessor: 'calories',
          },
          {
            Header: 'Fat (g)',
            id: 'fat',
            accessor: 'fat',
          },
          {
            Header: 'Carbs (g)',
            id: 'carbs',
            accessor: 'carbs',
          },
          {
            Header: 'Protein (g)',
            id: 'protein',
            accessor: 'protein',
          },
        ],
        data: [
          {
            dessert: 'Frozen yoghurt',
            calories: 159,
            fat: 6,
            carbs: 24,
            protein: 4,
          },
          {
            dessert: 'Ice cream sandwich',
            calories: 237,
            fat: 9,
            carbs: 37,
            protein: 4.3,
          },
          {
            dessert: 'Eclair',
            calories: 262,
            fat: 16,
            carbs: 24,
            protein: 6,
          },
          {
            dessert: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
          },
          {
            dessert: 'Gingerbread',
            calories: 356,
            fat: 16,
            carbs: 49,
            protein: 3.9,
          },
        ],
        emptyTips: '无数据',
        rowKey: 'dessert',
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '列设置',
      name: 'columns',
      type: 'object',
    },
    {
      label: '数据',
      name: 'data',
      type: 'object',
    },
    {
      label: '行ID',
      name: 'rowKey',
      type: 'string',
    },
    {
      label: '空白提示',
      name: 'emptyTips',
      type: 'string',
    },
    {
      label: '加载',
      name: 'loading',
      type: 'boolean',
    },
    {
      label: '允许选择',
      name: 'showCheckbox',
      type: 'boolean',
    },
    {
      label: '允许跨页选择',
      name: 'canAcrossPageChoose',
      type: 'boolean',
      desc: '仅在允许选择时生效',
    },
    {
      label: '允许设置列宽',
      name: 'canSetColumnWidth',
      type: 'boolean',
    },
    {
      label: '单行点击事件',
      name: 'onRowClick',
      type: 'function',
      willProps: {
        args: 'id, data',
      },
    },
    {
      label: '选中变化事件',
      name: 'onSelectChange',
      type: 'function',
      willProps: {
        args: 'selectedKeys, selectedRows',
      },
    },
    {
      label: '宽度变化事件',
      name: 'widthMapChange',
      type: 'function',
      desc: '仅在允许设置列宽时生效',
      willProps: {
        args: 'widthMap',
      },
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Table',
  manifest,
  propsSpec,
};
