import Radio from './radio';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'radio',
  icon: 'apps',
  label: '单选',
  category: 'form',
  component: Radio,
  configForm: ConfigForm,
  defaultConfig,
  order: 3,
};

export default elem;
