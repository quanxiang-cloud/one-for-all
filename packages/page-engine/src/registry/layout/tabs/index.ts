import Tabs from './tabs';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'tabs',
  icon: 'apps',
  label: '选项卡',
  category: 'layout',
  component: Tabs,
  configForm: ConfigForm,
  defaultConfig,
  order: 3,
  acceptChild: true,
};

export default elem;
