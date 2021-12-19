import { Input } from '@ofa/ui';
import ConfigForm, { defaultConfig } from './config-form';

type Props = {
  name?: string,
  placeholder?: string,
  rows?: number,
  cols?: number,
  required?: boolean,
  disable?: boolean,
}

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
