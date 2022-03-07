import  RadioGroupElm  from './radio';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';
import type { SourceElement } from '../../../index';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'radio',
  icon: 'apps',
  label: '单选',
  category: 'form',
  component: RadioGroupElm,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  exportActions: ['onChange'],
};
export default elem;

