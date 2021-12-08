import Input from './input';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'input',
  icon: 'apps',
  label: '单行文本',
  category: 'form',
  component: Input,
  configForm: ConfigForm,
  defaultConfig,
  order: 1,
};

export default elem;
