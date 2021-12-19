import ButtonElem from './button';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: Registry.SourceElement<Props> = {
  name: 'button',
  icon: 'apps',
  label: '按钮',
  category: 'basic',
  component: ButtonElem,
  configForm: ConfigForm,
  defaultConfig,
  order: 4,
};

export default elem;
