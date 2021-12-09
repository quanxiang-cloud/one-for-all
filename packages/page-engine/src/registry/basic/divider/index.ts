import Divider from './divider';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'divider',
  icon: 'apps',
  label: '分割线',
  category: 'basic',
  component: Divider,
  configForm: ConfigForm,
  defaultConfig,
  order: 6,
};

export default elem;
