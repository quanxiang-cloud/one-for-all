import Iframe from './iframe';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'iframe',
  icon: 'apps',
  label: 'Iframe',
  category: 'advanced',
  component: Iframe,
  configForm: ConfigForm,
  defaultConfig,
  order: 3,
};

export default elem;
