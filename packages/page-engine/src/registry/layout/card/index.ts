import Card from './card';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'card',
  icon: 'apps',
  label: '分组',
  category: 'layout',
  component: Card,
  configForm: ConfigForm,
  defaultConfig,
  order: 4,
  acceptChild: true,
};

export default elem;
