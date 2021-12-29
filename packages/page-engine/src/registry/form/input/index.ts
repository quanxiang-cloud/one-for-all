import { Input } from '@ofa/ui';
import ConfigForm, { defaultConfig } from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string,
  placeholder?: string,
  rows?: number,
  cols?: number,
  required?: boolean,
  disable?: boolean,
}

const elem: SourceElement<Props> = {
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
