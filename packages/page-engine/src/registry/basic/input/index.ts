import ConfigForm, { defaultConfig } from './config-form';
import Input from '@ofa/ui/src/input';

type Props = {
  name?: string,
  placeholder?: string,
  rows?: number,
  cols?: number,
  required?: boolean,
  disable?: boolean,
}

const elem: Registry.SourceElement<Props> = {
  name: 'input1',
  icon: 'apps',
  label: 'input框',
  category: 'basic',
  component: Input,
  configForm: ConfigForm,
  defaultConfig,
  order: 8,
};
export default elem;
