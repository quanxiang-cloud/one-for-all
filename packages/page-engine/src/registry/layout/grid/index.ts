import { Grid, GridProps } from '@ofa/ui';
import ConfigForm, { defaultConfig } from './config-form';
import type { SourceElement } from '@ofa/page-engine';

const elem: SourceElement<GridProps> = {
  name: 'grid',
  icon: 'layout-container',
  label: '布局容器',
  category: 'layout',
  component: Grid,
  configForm: ConfigForm,
  // toProps: (x: any)=> x,  // 默认configForm 返回的values 作为 组件的props
  defaultConfig,
  order: 1,
  acceptChild: true,
  exportActions: [],
  defaultStyle: {
    marginBottom: 16,
  },
};

export default elem;
