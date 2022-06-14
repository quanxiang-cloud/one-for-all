import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '高级组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'format_list_numbered',
        initialProps: {},
      },
      desc: '控制分页',
      label: '分页器',
      initialProps: {
        current: 1,
        total: 0,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50, 100],
        showSizeChanger: true,
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '当前页',
      type: 'number',
      name: 'current',
    },
    {
      label: '数据总条数',
      type: 'number',
      name: 'total',
    },
    {
      label: '每页数量',
      type: 'number',
      name: 'pageSize',
    },
    {
      label: '每页数量选项',
      type: 'object',
      name: 'pageSizeOptions',
    },
    {
      label: '显示页面切换',
      type: 'boolean',
      name: 'showSizeChanger',
    },
    {
      label: '显示快速切换',
      type: 'boolean',
      name: 'showQuickJumper',
    },
    {
      label: '显示更少的页码',
      type: 'boolean',
      name: 'showLessItems',
    },
    {
      label: '页码变化事件',
      type: 'function',
      name: 'onChange',
      willProps: {
        args: 'currentPage, pageSize',
      },
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Pagination',
  manifest,
  propsSpec,
};
