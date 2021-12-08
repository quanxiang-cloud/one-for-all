import Grid, { Props } from './grid';
import ConfigForm, { defaultConfig } from './config-form';

const elem: Registry.SourceElement<Props> = {
  name: 'grid',
  icon: 'apps',
  label: '布局容器',
  category: 'layout',
  component: Grid,
  configForm: ConfigForm,
  // toProps: (x: any)=> x,  // 默认configForm 返回的values 作为 组件的props
  defaultConfig,
  order: 1,
  acceptChild: true,
  expose: {},
};

export default elem;
