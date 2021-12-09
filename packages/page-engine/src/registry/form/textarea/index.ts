import Textarea from './textarea';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'textarea',
  icon: 'apps',
  label: '多行文本',
  category: 'form',
  component: Textarea,
  configForm: ConfigForm,
  defaultConfig,
  order: 2,
};

export default elem;
