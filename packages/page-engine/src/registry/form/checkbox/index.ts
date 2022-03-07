import CheckboxElm from './checkbox';
import ConfigForm, { DEFAULT_CONFIG }  from './config-form';
import type { SourceElement } from '../../../index';

interface Props {
  name?: string
}



const elem: SourceElement<Props> = {
  name: 'checkbox',
  icon: 'apps',
  label: '多选',
  category: 'form',
  component: CheckboxElm,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 9,
  exportActions: ['onChange'],
};
export default elem;


