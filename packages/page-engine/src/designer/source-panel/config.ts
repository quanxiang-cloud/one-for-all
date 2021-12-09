import { GroupProps } from './group';

export const groups: GroupProps[] = [
  {
    name: 'comps',
    label: '组件库',
    icon: 'application_management',
  },
  // {
  //   name: 'templates',
  //   label: '区块模板',
  //   icon: 'view',
  // },
  {
    name: 'page_tree',
    label: '页面层级',
    icon: 'option-set',
  },
  {
    name: 'data_source',
    label: '数据源',
    icon: 'database',
  },
];

export const panelTitle: { [key: string]: string } = {
  comps: '平台组件库',
  templates: '区块模板',
  page_tree: '页面层级',
  data_source: '数据源',
};
